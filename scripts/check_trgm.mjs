import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
try {
  const ext = await db.$queryRawUnsafe(`SELECT extname FROM pg_extension WHERE extname='pg_trgm'`);
  console.log('pg_trgm installed:', ext.length > 0);
  if (!ext.length) {
    try { await db.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS pg_trgm`); console.log('created pg_trgm'); }
    catch (e) { console.log('create failed:', e.message.slice(0, 100)); }
  }
  const sim = await db.$queryRawUnsafe(`SELECT similarity('physx','physics') AS s`);
  console.log('similarity works:', JSON.stringify(sim));
} catch (e) { console.log('ERR:', e.message.slice(0, 200)); } finally { await db.$disconnect(); }
