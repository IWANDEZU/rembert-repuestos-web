import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis;

function getPrismaClient() {
  if (globalForPrisma.__prisma) return globalForPrisma.__prisma;
  const dbUrl = globalForPrisma.__rembertDatabaseUrl || process.env.DATABASE_URL || "";
  const isValidPostgresUrl = /^(postgresql|postgres):\/\//i.test(dbUrl) && !dbUrl.includes("[SENSITIVE]");
  if (!isValidPostgresUrl) throw new Error("DATABASE_URL no configurada o inválida.");

  const adapter = new PrismaPg({
    connectionString: dbUrl,
    max: 2,
    idleTimeoutMillis: 5_000,
    connectionTimeoutMillis: 10_000,
  });
  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
  globalForPrisma.__prisma = client;
  return client;
}

export const prisma = new Proxy({}, {
  get(_target, property) {
    const client = getPrismaClient();
    const value = client[property];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
