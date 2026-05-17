import { PrismaClient } from '@prisma/client'

// Neon PostgreSQL connection URL - must be set BEFORE PrismaClient is instantiated
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_omga5szZAf4l@ep-shiny-paper-aousfq8l-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'

// CRITICAL: Set DATABASE_URL in process.env BEFORE PrismaClient init
// Prisma validates env("DATABASE_URL") from schema.prisma at initialization time
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = DATABASE_URL
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
