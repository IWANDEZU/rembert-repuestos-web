const { PrismaClient } = require("@prisma/client");

function createPrismaClient(databaseUrl = process.env.DATABASE_URL) {
  if (!/^postgres(?:ql)?:\/\//i.test(databaseUrl || "")) {
    throw new Error("DATABASE_URL debe contener una conexión PostgreSQL válida.");
  }

  return new PrismaClient({
    datasources: {
      db: { url: databaseUrl },
    },
  });
}

module.exports = { createPrismaClient };
