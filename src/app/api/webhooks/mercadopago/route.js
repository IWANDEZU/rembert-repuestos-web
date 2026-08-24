import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const verifySignature = ({ signature, requestId, dataId, secret }) => {
  if (!signature || !requestId || !dataId || !secret) return false;
  const parts = Object.fromEntries(signature.split(",").map((part) => part.trim().split("=", 2)));
  if (!parts.ts || !parts.v1 || !/^[a-f0-9]{64}$/i.test(parts.v1)) return false;
  const manifest = `id:${String(dataId).toLowerCase()};request-id:${requestId};ts:${parts.ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest();
  const provided = Buffer.from(parts.v1, "hex");
  return provided.length === expected.length && timingSafeEqual(provided, expected);
};

export async function POST(request) {
  try {
    const url = new URL(request.url);
    const body = await request.json().catch(() => ({}));
    const action = url.searchParams.get("topic") || url.searchParams.get("type") || body.type;
    const id = url.searchParams.get("id") || url.searchParams.get("data.id") || body.data?.id;
    const webhookSecret = process.env.MP_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("MP_WEBHOOK_SECRET no está configurado");
      return NextResponse.json({ error: "Webhook no configurado" }, { status: 503 });
    }

    const authentic = verifySignature({
      signature: request.headers.get("x-signature"),
      requestId: request.headers.get("x-request-id"),
      dataId: id,
      secret: webhookSecret,
    });
    if (!authentic) return NextResponse.json({ error: "Firma inválida" }, { status: 401 });

    if (action === "payment" && id && process.env.MP_ACCESS_TOKEN) {
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      });

      if (response.ok) {
        const paymentInfo = await response.json();
        if (paymentInfo.status === "approved") {
          const orderId = paymentInfo.external_reference;
          if (orderId) {
            const existingOrder = await prisma.order.findUnique({
              where: { id: orderId },
              select: { id: true, totalAmount: true, paymentId: true, paymentStatus: true },
            });

            const amountMatches = existingOrder && Math.abs(Number(paymentInfo.transaction_amount) - existingOrder.totalAmount) < 0.01;
            const currencyMatches = paymentInfo.currency_id === "COP";
            const paymentIsNew = !existingOrder?.paymentId || existingOrder.paymentId === String(id);

            if (existingOrder && amountMatches && currencyMatches && paymentIsNew) {
              await prisma.order.update({
                where: { id: orderId },
                data: {
                  status: "PAID",
                  paymentId: String(id),
                  paymentStatus: "SUCCESS",
                },
              });
            } else {
              console.error("Pago Mercado Pago rechazado por inconsistencia", { orderId, paymentId: String(id) });
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 200 });
  }
}
