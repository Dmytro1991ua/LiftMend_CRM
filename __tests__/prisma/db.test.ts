import { changeLogPrismaClient, createAppPrismaClient } from '@/prisma/db';

describe('Prisma client setup', () => {
  it('should create App Prisma client', () => {
    const prisma = createAppPrismaClient('test-user');

    expect(prisma).toBeDefined();
  });

  it('should have changeLogPrismaClient defined', () => {
    expect(changeLogPrismaClient).toBeDefined();
  });
});
