import { getServerSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { SiigoApiClient, AlegraApiClient, POS_PROVIDERS } from "@/lib/posIntegrations";
import { enforceRateLimit } from "@/lib/security/rateLimit";
import { createHash, timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const secretsMatch = (provided, expected) => {
  if (!provided || !expected) return false;
  const left = createHash("sha256").update(provided).digest();
  const right = createHash("sha256").update(expected).digest();
  return timingSafeEqual(left, right);
};

/**
 * Endpoint para disparar sincronización activa hacia el POS (Siigo / Alegra)
 * GET/POST /api/pos/sync?provider=siigo|alegra
 */
export async function POST(request) {
  const limited = await enforceRateLimit(request, { scope: "pos-sync", limit: 10, windowMs: 60_000 });
  if (limited) return limited;
  try {
    const session = await getServerSession();
    const authHeader = request.headers.get("authorization");
    const posApiKey = request.headers.get("x-pos-key");
    const expectedSecret = process.env.POS_SYNC_SECRET;

    if (!expectedSecret && session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Sincronización deshabilitada: POS_SYNC_SECRET no configurado en el servidor" }, { status: 500 });
    }

    const isAuthorized = 
      session?.user?.role === "ADMIN" || 
      secretsMatch(posApiKey || authHeader?.replace(/^Bearer\s+/i, ""), expectedSecret);

    if (!isAuthorized) {
      return NextResponse.json({ error: "No autorizado para sincronizar con POS" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const provider = searchParams.get("provider") || POS_PROVIDERS.SIIGO;

    let syncedItems = [];
    if (provider === POS_PROVIDERS.SIIGO || provider === POS_PROVIDERS.ZOE_POS) {
      const client = new SiigoApiClient({});
      const data = await client.getProducts({ pageSize: 50 });
      syncedItems = data.results;
    } else if (provider === POS_PROVIDERS.ALEGRA) {
      const client = new AlegraApiClient({});
      syncedItems = await client.getProducts({ limit: 50 });
    } else {
      return NextResponse.json({ error: "Proveedor no soportado para sync directo. Use /api/pos/webhook." }, { status: 400 });
    }

    // Reenviar al webhook interno para procesar y persistir en la BD
    const webhookRes = await fetch(`${new URL(request.url).origin}/api/pos/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-pos-key": expectedSecret },
      body: JSON.stringify({ items: syncedItems, provider }),
    });

    const resultData = await webhookRes.json();
    return NextResponse.json(resultData);
  } catch (error) {
    console.error("Error disparando sincronización POS:", error);
    return NextResponse.json(
      { error: "Error en sincronización con POS" },
      { status: 500 }
    );
  }
}
