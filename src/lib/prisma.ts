import { PrismaClient } from '@/generated/prisma';

// Single PrismaClient across hot-reloads in dev and across warm serverless
// invocations in prod. On Vercel each function instance reuses this between
// requests; the Supabase pooler (pgbouncer) keeps the actual DB connections low.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
