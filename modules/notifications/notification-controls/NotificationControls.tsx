import { useCallback } from 'react';

import { FaCheck } from 'react-icons/fa';

import BaseButton from '@/shared/base-button';
import usePageFilters from '@/shared/base-table/hooks/useFilterInTable';
import PageFilters from '@/shared/base-table/table-filters';

import { useMarkAllNotificationsAsRead } from '../hooks/useMarkAllNotificationsAsRead';
import { NotificationsState } from '../type';

import { NOTIFICATIONS_PAGE_FILTERS_CONFIG } from './config';

const NotificationControls = ({
  areAllNotificationsRead,
  notificationsPageStoredState,
  onSetNotificationsPageStoredState,
  isDisabled,
}: Pick<
  NotificationsState,
  'areAllNotificationsRead' | 'notificationsPageStoredState' | 'onSetNotificationsPageStoredState' | 'isDisabled'
>) => {
  const { loading, onMarkAllNotificationsAsRead } = useMarkAllNotificationsAsRead();

  const { filters, onFilterChange, onClearFilter } = usePageFilters({
    tableStorageState: notificationsPageStoredState,
    onSetTableStorageState: onSetNotificationsPageStoredState,
  });

  const onMarkAllAsRead = useCallback(async () => await onMarkAllNotificationsAsRead(), [onMarkAllNotificationsAsRead]);

  return (
    <section className='flex items-center gap-2' data-testid='notification-controls'>
      <BaseButton
        className='h-10'
        icon={<FaCheck />}
        isDisabled={areAllNotificationsRead || loading || isDisabled}
        isLoading={loading}
        label='Mark All as Read'
        type='button'
        variant='default'
        onClick={onMarkAllAsRead}
      />
      <PageFilters
        isAccordionAutoHeight
        filtersConfig={NOTIFICATIONS_PAGE_FILTERS_CONFIG}
        isDisabled={isDisabled}
        storedFilters={filters}
        onClearFilter={onClearFilter}
        onFilterChange={onFilterChange}
      />
    </section>
  );
};

export default NotificationControls;
