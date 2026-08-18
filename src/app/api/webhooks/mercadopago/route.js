import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get("topic") || url.searchParams.get("type");
    const id = url.searchParams.get("id") || url.searchParams.get("data.id");

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
              select: { id: true },
            });

            if (existingOrder) {
              await prisma.order.update({
                where: { id: orderId },
                data: {
                  status: "PAID",
                  paymentId: String(id),
                  paymentStatus: "SUCCESS",
                },
              });
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
