import { PrismaClient } from '@prisma/client';

import { registerChangeLogMiddleware } from './middleware/registerChangeLogMiddleware';

/**
 * We intentionally use TWO Prisma clients.
 *
 * createAppPrismaClient():
 * - Used by API, Apollo, and cron jobs
 * - Has ChangeLog middleware attached
 *
 * changeLogPrismaClient:
 * - Used only to write ChangeLog records
 * - No middleware, otherwise ChangeLog writes would trigger
 *   the middleware again and cause infinite recursion
 */

export const changeLogPrismaClient = new PrismaClient({
  log: ['query', 'warn', 'info', 'error'],
});

// Singleton for app Prisma client in dev mode
let appPrismaGlobal: PrismaClient | undefined;

export const createAppPrismaClient = (userId?: string) => {
  // Reuse the Prisma client in dev to prevent multiple connections
  if (process.env.NODE_ENV !== 'production' && appPrismaGlobal) {
    return appPrismaGlobal;
  }

  const prisma = new PrismaClient({
    log: ['query', 'warn', 'info', 'error'],
  });

  registerChangeLogMiddleware(prisma, userId);

  // Save the instance only in development
  if (process.env.NODE_ENV !== 'production') {
    appPrismaGlobal = prisma;
  }

  return prisma;
};
