import prisma from '@/prisma/db';

import { NotificationPayload } from './types';

export const createNotificationIfNotExists = async ({
  jobId,
  category,
  message,
  priority,
  userId,
}: NotificationPayload): Promise<void> => {
  const existNotification = await prisma.notification.findFirst({
    where: { relatedEntityId: jobId, category },
  });

  if (!existNotification) {
    await prisma.notification.create({
      data: { userId, relatedEntityId: jobId, category, message, priority, status: 'Unread', readAt: null },
    });
  }
};
