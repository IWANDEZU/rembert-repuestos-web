import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

// Reuse one client during local hot reloads. Vercel creates a fresh runtime for
// a cold start, while warm invocations reuse this module instance.
export const prisma =
  globalForPrisma.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__prisma = prisma;
}
