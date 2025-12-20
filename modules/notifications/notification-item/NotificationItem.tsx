import { useCallback } from 'react';

import { cn } from '@/lib/utils';
import { Notification } from '@/shared/types';

import {
  DEFAULT_BADGE_STYLE,
  NOTIFICATION_BADGE_STYLES,
  READ_NOTIFICATION_STYLE,
  UNREAD_NOTIFICATION_STYLES,
} from '../constants';
import { useMarkNotificationAsRead } from '../hooks/useMarkNotificationAsRead';

export type NotificationItemProps = {
  notification: Notification;
};

const NotificationItem = ({ notification }: NotificationItemProps) => {
  const { onMarkNotificationAsRead } = useMarkNotificationAsRead();

  const { status, message, category } = notification;

  const isNotificationUnread = status === 'Unread';
  const notificationStyle = isNotificationUnread ? UNREAD_NOTIFICATION_STYLES[category] : READ_NOTIFICATION_STYLE;
  const notificationBadgeStyle = isNotificationUnread
    ? NOTIFICATION_BADGE_STYLES[category] ?? DEFAULT_BADGE_STYLE
    : DEFAULT_BADGE_STYLE;

  const onMarkAsRed = useCallback(
    async () => await onMarkNotificationAsRead(notification.id, isNotificationUnread),
    [notification.id, isNotificationUnread, onMarkNotificationAsRead]
  );

  return (
    <div
      className={cn(
        'flex items-center font-semibold p-3 rounded-lg border mb-2 shadow-sm cursor-pointer',
        'transition duration-500 ease-in-out',
        notificationStyle
      )}
      data-testid='notification-item'
      onClick={onMarkAsRed}
    >
      <span
        className={cn('mr-3 px-3 py-2 text-xs font-bold rounded-full uppercase flex-shrink-0', notificationBadgeStyle)}
      >
        {category}
      </span>
      <p className='text-sm md:text-base'>{message}</p>
    </div>
  );
};

export default NotificationItem;
