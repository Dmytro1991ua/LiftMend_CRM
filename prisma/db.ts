import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

if (process.env.NODE_ENV === 'production') {
  console.log('Prisma API URL in prod:', process.env.DATABASE_URL);
} else {
  console.log('Prisma API URL in dev:', process.env.DATABASE_URL);
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!globalThis.prismaGlobal) {
    globalThis.prismaGlobal = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  prisma = globalThis.prismaGlobal;
}

export default prisma;
