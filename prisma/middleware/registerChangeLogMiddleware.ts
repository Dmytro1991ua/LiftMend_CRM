import { PrismaClient } from '@prisma/client';

import { EntityWithId } from '../types';
import { createChangeLogEntry } from '../utils';

const PRISMA_WRITE_OPERATIONS = ['create', 'update', 'delete'];

export const registerChangeLogMiddleware = (prisma: PrismaClient, userId?: string) => {
  prisma.$use(async (params, next) => {
    const { model, action, args } = params;

    // Ignore reads & ChangeLog writes
    if (!model || model === 'ChangeLog') return next(params);
    if (!PRISMA_WRITE_OPERATIONS.includes(action)) return next(params);

    let before: EntityWithId | null = null;

    if ((action === 'update' || action === 'delete') && args?.where) {
      // TS cannot call a union of Prisma delegates with different generics dynamically.
      // Casting to `any` is the minimal compromise; runtime call is safe.
      before = await (prisma as any)[model].findUnique({
        where: args.where,
      });
    }

    const result = await next(params);

    if (action === 'create' && result?.id) {
      await createChangeLogEntry(
        {
          entityType: model,
          entityId: result.id,
          action,
          oldValue: null,
          newValue: result,
        },
        userId
      );
    }

    if (action === 'update' && before) {
      await createChangeLogEntry(
        {
          entityType: model,
          entityId: before.id,
          action,
          oldValue: before,
          newValue: result,
        },
        userId
      );
    }

    if (action === 'delete' && before) {
      await createChangeLogEntry(
        {
          entityType: model,
          entityId: before.id,
          action,
          oldValue: before,
          newValue: null,
        },
        userId
      );
    }

    return result;
  });
};
