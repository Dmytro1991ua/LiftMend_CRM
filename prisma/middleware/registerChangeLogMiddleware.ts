import { PrismaClient } from '@prisma/client';

import { ChangeLogAction, EntityWithId } from '../types';
import { createChangeLogEntry } from '../utils';

import { buildChangeLogPayload } from './utils';

const PRISMA_WRITE_OPERATIONS = new Set(['create', 'update', 'delete']);

export const registerChangeLogMiddleware = (prisma: PrismaClient, userId?: string) => {
  prisma.$use(async (params, next) => {
    const { model, action, args } = params;

    // Ignore reads & ChangeLog writes
    if (!model || model === 'ChangeLog') return next(params);
    if (!PRISMA_WRITE_OPERATIONS.has(action)) return next(params);

    let before: EntityWithId | null = null;

    if ((action === 'update' || action === 'delete') && args?.where) {
      // TS cannot call a union of Prisma delegates with different generics dynamically.
      // Casting to `any` is the minimal compromise; runtime call is safe.
      before = await (prisma as any)[model].findUnique({ where: args.where });
    }

    const result = await next(params);

    const payload = buildChangeLogPayload(action as ChangeLogAction, model, before, result);

    if (payload) {
      await createChangeLogEntry(payload, userId);
    }

    return result;
  });
};
