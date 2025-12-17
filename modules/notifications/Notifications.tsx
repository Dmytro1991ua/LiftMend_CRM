import { useMemo } from 'react';

import InfiniteScroll from 'react-infinite-scroll-component';
import { Bars } from 'react-loader-spinner';

import { cn } from '@/lib/utils';
import GoBackButton from '@/shared/base-button/go-back-button';
import SectionHeader from '@/shared/section-header';
import { getDerivedDataLoadStatus } from '@/shared/utils';

import { getNotificationsLoadStatusView } from './config';
import { useGetNotifications } from './hooks';
import { useMarkNotificationAsRead } from './hooks/useMarkNotificationAsRead';
import NotificationItem from './notification-item';

const Notifications = () => {
  const { notifications, isInitialLoading, isNotificationsEmpty, hasMore, totalNotificationsLength, error, onNext } =
    useGetNotifications();

  const notificationsLoadStatus = getDerivedDataLoadStatus(isNotificationsEmpty, isInitialLoading, error);
  const notificationsLoadStatusView = useMemo(() => getNotificationsLoadStatusView({ errorMessage: error }), [error]);

  if (notificationsLoadStatus) {
    return notificationsLoadStatusView[notificationsLoadStatus];
  }

  return (
    <section>
      <SectionHeader goBackButton={<GoBackButton />} title='Messages History' />
      <div className={cn('flex flex-column h-dvh content-wrapper')}>
        <div className='h-[60rem] w-full overflow-y-auto' id='scrollable-notifications'>
          <InfiniteScroll
            dataLength={totalNotificationsLength}
            hasMore={hasMore}
            loader={
              <Bars
                ariaLabel='bars-loading'
                color='#306cce'
                height='30'
                visible={hasMore}
                width='30'
                wrapperClass='justify-center py-2'
              />
            }
            next={onNext}
            scrollThreshold={0.99}
            scrollableTarget='scrollable-notifications'
          >
            {notifications.map(({ label, items }) => (
              <div key={label} className='mb-4'>
                <h4 className='text-gray-400 text-sm uppercase mb-4 pb-1 border-b-2 font-bold'>{label}</h4>
                {items.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </div>
    </section>
  );
};

export default Notifications;
