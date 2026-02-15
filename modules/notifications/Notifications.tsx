import PaginatedListPage from '@/shared/paginated-list-page';

import { DEFAULT_EMPTY_NOTIFICATION_PAGE_MESSAGE, DEFAULT_ERROR_RESPONSE_MESSAGE } from './constants';
import { useGetNotifications } from './hooks';
import NotificationControls from './notification-controls';
import NotificationItem from './notification-item';

const Notifications = () => {
  const {
    notifications,
    isInitialLoading,
    isNotificationsEmpty,
    hasMore,
    totalNotificationsLength,
    areAllNotificationsRead,
    error,
    notificationsPageStoredState,
    sanitizedDateRange,
    isCalendarOpen,
    onHandleCalendarPopoverClose,
    onSetNotificationsPageStoredState,
    onNext,
  } = useGetNotifications();

  return (
    <PaginatedListPage
      controls={
        <NotificationControls
          areAllNotificationsRead={areAllNotificationsRead}
          isCalendarOpen={isCalendarOpen}
          isDisabled={isNotificationsEmpty}
          notificationsPageStoredState={notificationsPageStoredState}
          sanitizedDateRange={sanitizedDateRange}
          onHandleCalendarPopoverClose={onHandleCalendarPopoverClose}
          onSetNotificationsPageStoredState={onSetNotificationsPageStoredState}
        />
      }
      emptyStateMessage={DEFAULT_EMPTY_NOTIFICATION_PAGE_MESSAGE}
      errorMessage={error}
      errorTitle={DEFAULT_ERROR_RESPONSE_MESSAGE}
      hasMore={hasMore}
      isEmpty={isNotificationsEmpty}
      isInitialLoading={isInitialLoading}
      sectionTitle='Messages History'
      totalItems={totalNotificationsLength}
      onNext={onNext}
    >
      {notifications.map(({ label, items }) => (
        <div key={label} className='mb-4'>
          <h4 className='text-gray-400 text-sm uppercase mb-4 pb-1 border-b-2 font-bold'>{label}</h4>
          {items.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      ))}
    </PaginatedListPage>
  );
};

export default Notifications;
