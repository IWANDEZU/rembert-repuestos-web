import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { message: "El registro ahora se procesa de forma segura mediante Supabase Auth." },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
}
