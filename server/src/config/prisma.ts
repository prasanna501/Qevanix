import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

export async function checkDatabaseConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { connected: true, message: 'Database connected successfully' };
  } catch (error: any) {
    console.error('❌ Database connection check failed:', error?.message || error);
    return { connected: false, message: error?.message || 'Database connection error' };
  }
}
