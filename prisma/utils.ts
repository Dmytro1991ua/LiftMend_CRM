import { changeLogPrismaClient } from './db';
import { ChangeLogCreateParams } from './types';

export const createChangeLogEntry = async (params: ChangeLogCreateParams, userId?: string) => {
  try {
    await changeLogPrismaClient.changeLog.create({
      data: {
        userId,
        entityType: params.entityType,
        entityId: params.entityId,
        action: params.action,
        field: '*',
        oldValue: params.oldValue !== null ? JSON.stringify(params.oldValue) : null,
        newValue: params.newValue !== null ? JSON.stringify(params.newValue) : null,
      },
    });
  } catch (err) {
    console.error('Failed to create change log entry:', params, err);
  }
};
