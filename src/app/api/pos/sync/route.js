import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { SiigoApiClient, AlegraApiClient, POS_PROVIDERS } from "@/lib/posIntegrations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Endpoint para disparar sincronización activa hacia el POS (Siigo / Alegra)
 * GET/POST /api/pos/sync?provider=siigo|alegra
 */
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    const authHeader = request.headers.get("authorization");
    const secretQuery = new URL(request.url).searchParams.get("secret");
    const expectedSecret = process.env.POS_SYNC_SECRET;

    if (!expectedSecret && session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Sincronización deshabilitada: POS_SYNC_SECRET no configurado en el servidor" }, { status: 500 });
    }

    const isAuthorized = 
      session?.user?.role === "ADMIN" || 
      (expectedSecret && (secretQuery === expectedSecret || authHeader === `Bearer ${expectedSecret}`));

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
    const webhookRes = await fetch(`${new URL(request.url).origin}/api/pos/webhook?secret=${expectedSecret}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: syncedItems, provider }),
    });

    const resultData = await webhookRes.json();
    return NextResponse.json(resultData);
  } catch (error) {
    console.error("Error disparando sincronización POS:", error);
    return NextResponse.json(
      { error: "Error en sincronización con POS", message: error.message },
      { status: 500 }
    );
  }
}
