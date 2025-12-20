import { useCallback } from 'react';

import { FaCheck } from 'react-icons/fa';

import BaseButton from '@/shared/base-button';

import { useMarkAllNotificationsAsRead } from '../hooks/useMarkAllNotificationsAsRead';

export type NotificationControlsProps = {
  areAllNotificationsRead: boolean;
};

const NotificationControls = ({ areAllNotificationsRead }: NotificationControlsProps) => {
  const { loading, onMarkAllNotificationsAsRead } = useMarkAllNotificationsAsRead();

  const onMarkAllAsRead = useCallback(async () => await onMarkAllNotificationsAsRead(), [onMarkAllNotificationsAsRead]);

  return (
    <section className='flex gap-2' data-testid='notification-controls'>
      <BaseButton
        icon={<FaCheck />}
        isDisabled={areAllNotificationsRead || loading}
        isLoading={loading}
        label='Mark All as Read'
        type='button'
        variant='default'
        onClick={onMarkAllAsRead}
      />
    </section>
  );
};

export default NotificationControls;
