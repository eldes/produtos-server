import { PrismaClient } from '../generated/prisma';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Você pode ajustar pool via query string:
    // ex: &connection_limit=10&pool_timeout=15&connect_timeout=10
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;