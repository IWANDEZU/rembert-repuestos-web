import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { CatalogDomainError } from "../domain/catalogErrors";

export function catalogErrorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "CATALOG_VALIDATION_ERROR",
        message: "La solicitud contiene datos inválidos.",
        issues: error.issues.map((issue) => ({
          path: issue.path.map(String).join("."),
          message: issue.message,
        })),
      },
      { status: 422 },
    );
  }

  if (error instanceof CatalogDomainError) {
    return NextResponse.json(
      { error: error.code, message: error.message, details: error.details },
      { status: error.status },
    );
  }

  console.error("Catalog API error:", error);
  return NextResponse.json(
    { error: "CATALOG_INTERNAL_ERROR", message: "No fue posible procesar la operación de catálogo." },
    { status: 500 },
  );
}
