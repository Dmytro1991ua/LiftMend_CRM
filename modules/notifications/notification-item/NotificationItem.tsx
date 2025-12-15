import { cn } from '@/lib/utils';
import { Notification } from '@/shared/types';

import { READ_NOTIFICATION_STYLE, UNREAD_NOTIFICATION_STYLES } from '../constants';

export type NotificationItemProps = {
  notification: Notification;
};

const NotificationItem = ({ notification }: NotificationItemProps) => {
  const { status, message, category } = notification;

  const isNotificationUnread = status === 'Unread';
  const notificationStyle = isNotificationUnread ? UNREAD_NOTIFICATION_STYLES[category] : READ_NOTIFICATION_STYLE;

  return (
    <div
      className={cn(
        'flex items-start font-semibold p-3 rounded-lg border transition-colors duration-200 mb-2 shadow-sm',
        notificationStyle
      )}
      data-testid='notification-item'
    >
      <p className='text-sm md:text-base'>{message}</p>
    </div>
  );
};

export default NotificationItem;
