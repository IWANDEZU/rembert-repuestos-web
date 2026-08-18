import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteUserData } from "@/lib/deleteUserData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function decodeBase64Url(value) {
  return Buffer.from(value.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

function readSignedRequest(signedRequest, secret) {
  if (typeof signedRequest !== "string" || !secret) return null;
  const [encodedSignature, encodedPayload, ...rest] = signedRequest.split(".");
  if (!encodedSignature || !encodedPayload || rest.length) return null;

  const received = decodeBase64Url(encodedSignature);
  const expected = crypto.createHmac("sha256", secret).update(encodedPayload).digest();
  if (received.length !== expected.length || !crypto.timingSafeEqual(received, expected)) return null;

  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload).toString("utf8"));
    return typeof payload.user_id === "string" ? payload : null;
  } catch {
    return null;
  }
}

function confirmationCode(userId, secret) {
  return crypto.createHmac("sha256", secret).update(`facebook-data-deletion:${userId}`).digest("hex");
}

export async function POST(request) {
  const secret = process.env.FACEBOOK_CLIENT_SECRET;
  if (!secret) return NextResponse.json({ error: "Integración no configurada" }, { status: 503 });

  const contentType = request.headers.get("content-type") || "";
  let signedRequest;
  try {
    signedRequest = contentType.includes("application/json")
      ? (await request.json()).signed_request
      : (await request.formData()).get("signed_request");
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const payload = readSignedRequest(signedRequest, secret);
  if (!payload) return NextResponse.json({ error: "Firma inválida" }, { status: 400 });

  const account = await prisma.account.findUnique({
    where: { provider_providerAccountId: { provider: "facebook", providerAccountId: payload.user_id } },
    select: { userId: true },
  });
  if (account) await deleteUserData(account.userId);

  const code = confirmationCode(payload.user_id, secret);
  return NextResponse.json({
    url: `${new URL(request.url).origin}/eliminar-datos?code=${code}`,
    confirmation_code: code,
  });
}
