import { PrismaClient } from '@prisma/client'

// Override DATABASE_URL BEFORE creating PrismaClient
// The FUSE filesystem at /home/z/my-project doesn't support SQLite writes
if (typeof process !== 'undefined' && process.env) {
  process.env.DATABASE_URL = 'file:/tmp/chemtest_db/custom.db'
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Force create a new client to pick up the new URL
if (process.env.NODE_ENV !== 'production') {
  if (globalForPrisma.prisma) {
    // Disconnect old client
    globalForPrisma.prisma.$disconnect().catch(() => {})
  }
  globalForPrisma.prisma = undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
