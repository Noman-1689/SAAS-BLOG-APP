import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

let prisma = globalForPrisma.prisma || null;

if (!prisma) {
  prisma = new PrismaClient({
    log: ["query", "warn", "error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  globalForPrisma.prisma = prisma;
}

export default prisma;
