import { NextResponse } from "next/server";

function retired() {
  return NextResponse.json(
    { message: "Este endpoint fue reemplazado por Supabase Auth." },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
}

export const GET = retired;
export const POST = retired;
