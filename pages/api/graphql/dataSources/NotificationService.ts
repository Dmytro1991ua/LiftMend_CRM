import { Notification, Prisma, PrismaClient } from '@prisma/client';

import { NotificationConnection, QueryGetNotificationsArgs } from '@/graphql/types/server/generated_types';

import { createNotificationFilterOptions, makeConnectionObject } from '../utils/utils';

import { DEFAULT_SORTING_OPTION } from './constants';

export type MarkAllNotificationAsReadResult = {
  updatedNotificationIds: string[];
};

class NotificationService {
  private prisma;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async notifications(args: QueryGetNotificationsArgs): Promise<NotificationConnection> {
    const { paginationOptions, filterOptions } = args;

    const filters = createNotificationFilterOptions(filterOptions);

    const queryOptions: Prisma.NotificationFindManyArgs = {
      where: filters,
      orderBy: { createdAt: DEFAULT_SORTING_OPTION },
    };

    if (paginationOptions) {
      queryOptions.skip = paginationOptions.offset ?? undefined;
      queryOptions.take = paginationOptions.limit ?? undefined;
    }

    const notifications = await this.prisma.notification.findMany(queryOptions);

    const totalItems = await this.prisma.notification.count({
      where: filters,
    });

    return makeConnectionObject({
      items: notifications,
      totalItems,
      paginationOptions,
      getCursor: (notification: Notification) => notification.id,
    });
  }

  async unreadNotificationsCount(): Promise<number> {
    return this.prisma.notification.count({ where: { status: 'Unread' } });
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { status: 'Read', readAt: new Date() },
    });
  }

  async markAllAsRead(): Promise<MarkAllNotificationAsReadResult> {
    const unreadNotifications = await this.prisma.notification.findMany({
      where: {
        status: 'Unread',
      },
      select: { id: true },
    });

    const markAsReadTasks = unreadNotifications.map(async ({ id }) => {
      await this.prisma.notification.update({
        where: { id },
        data: { status: 'Read', readAt: new Date() },
      });

      return id;
    });

    const updatedNotificationIds = await Promise.all(markAsReadTasks);

    return { updatedNotificationIds };
  }
}

export default NotificationService;
