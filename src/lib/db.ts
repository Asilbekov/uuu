import { PrismaClient } from "@prisma/client";

/**
 * The connection string is configuration, never source code. In Vercel set
 * DATABASE_URL to the Neon pooled URL; use the direct URL only for migrations.
 */
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not configured. Add it to .env.local or Vercel Environment Variables.",
  );
}

if (!/^postgres(ql)?:\/\//.test(databaseUrl)) {
  throw new Error("DATABASE_URL must be a PostgreSQL connection string");
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: { db: { url: databaseUrl } },
  });

// Prevent a new connection pool on every Next.js development hot reload.
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
