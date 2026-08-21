import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis;

const dbUrl = process.env.DATABASE_URL || "";
const isValidPostgresUrl =
  (dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://")) &&
  !dbUrl.includes("[SENSITIVE]");

let prismaInstance;

if (isValidPostgresUrl) {
  try {
    const adapter = new PrismaPg({
      connectionString: dbUrl,
      max: 5,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
    });
    prismaInstance =
      globalForPrisma.__prisma ??
      new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
      });
  } catch (err) {
    console.warn("No se pudo instanciar PrismaClient con la URL actual:", err.message);
  }
}

if (!prismaInstance) {
  // Proxy seguro para desarrollo local sin conexión remota configurada
  prismaInstance = new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === "$connect" || prop === "$disconnect") {
          return async () => {};
        }
        return new Proxy(
          {},
          {
            get(_mTarget, _method) {
              return async () => {
                throw new Error("DATABASE_URL no configurada o inválida. Usando datos locales de respaldo.");
              };
            },
          }
        );
      },
    }
  );
}

export const prisma = prismaInstance;

if (process.env.NODE_ENV !== "production" && isValidPostgresUrl) {
  globalForPrisma.__prisma = prisma;
}
