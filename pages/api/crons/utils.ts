import { PrismaClient } from '@prisma/client';

import { NotificationPayload } from './types';

export const createNotificationIfNotExists = async (
  prisma: PrismaClient,
  payload: NotificationPayload
): Promise<void> => {
  const { jobId, category, message, priority, userId } = payload;

  const existNotification = await prisma.notification.findFirst({
    where: { relatedEntityId: jobId, category },
  });

  if (!existNotification) {
    await prisma.notification.create({
      data: { userId, relatedEntityId: jobId, category, message, priority, status: 'Unread', readAt: null },
    });
  }
};
