import { PrismaClient } from '@prisma/client'

// Set DATABASE_URL at runtime for Neon PostgreSQL
const NEON_URL = 'postgresql://neondb_owner:npg_omga5szZAf4l@ep-shiny-paper-aousfq8l-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&connection_limit=5&pool_timeout=30'

if (typeof process !== 'undefined' && process.env) {
  process.env.DATABASE_URL = NEON_URL
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error'],
  datasources: {
    db: {
      url: NEON_URL,
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Handle connection errors gracefully
db.$connect().catch((err) => {
  console.error('Failed to connect to database:', err)
})

// Prevent unhandled rejections from crashing the process
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason)
})
