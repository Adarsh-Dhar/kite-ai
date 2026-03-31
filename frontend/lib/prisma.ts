// frontend/lib/prisma.ts
// Singleton Prisma client — safe for Next.js dev (hot reload) and production.
//
// Usage anywhere in the app:
//   import { prisma } from '@/lib/prisma'
//   const markets = await prisma.market.findMany()

import { PrismaClient } from '@/lib/generated/client/client'
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
export { prisma };