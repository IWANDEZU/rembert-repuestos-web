const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

function createPrismaClient(databaseUrl = process.env.DATABASE_URL) {
  if (!/^postgres(?:ql)?:\/\//i.test(databaseUrl || "")) {
    throw new Error("DATABASE_URL debe contener una conexión PostgreSQL válida.");
  }

  const adapter = new PrismaPg({
    connectionString: databaseUrl,
    max: 5,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
  });

  return new PrismaClient({ adapter });
}

module.exports = { createPrismaClient };
