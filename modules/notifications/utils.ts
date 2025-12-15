import { format, isToday, isYesterday, startOfDay } from 'date-fns';

import { Notification } from '@/shared/types';

import { NotificationDateGroup } from './type';

export const getNotificationDayLabel = (date: Date): string => {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';

  return format(date, 'dd MMMM');
};

export const groupNotificationsByDate = (notifications: Notification[]): NotificationDateGroup[] => {
  const notificationsByDay = new Map<string, NotificationDateGroup>();

  notifications.forEach((notification) => {
    const localDate = new Date(notification.createdAt);
    const dayKey = startOfDay(localDate).toISOString();

    if (!notificationsByDay.has(dayKey)) {
      notificationsByDay.set(dayKey, {
        label: getNotificationDayLabel(localDate),
        items: [],
      });
    }

    notificationsByDay.get(dayKey)?.items.push(notification);
  });

  return Array.from(notificationsByDay.values());
};
