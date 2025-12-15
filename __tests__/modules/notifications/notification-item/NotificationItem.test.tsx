import { render, screen } from '@testing-library/react';

import { mockUpcomingNotification } from '@/mocks/notificationMocks';
import { READ_NOTIFICATION_STYLE, UNREAD_NOTIFICATION_STYLES } from '@/modules/notifications/constants';
import NotificationItem, { NotificationItemProps } from '@/modules/notifications/notification-item/NotificationItem';
import { Notification } from '@/shared/types';

describe('NotificationItem', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    notification: mockUpcomingNotification as unknown as Notification,
  };

  const NotificationItemComponent = (props?: Partial<NotificationItemProps>) => (
    <NotificationItem {...defaultProps} {...props} />
  );

  it('should render component without crashing', () => {
    render(NotificationItemComponent());

    expect(screen.getByTestId('notification-item')).toBeInTheDocument();
    expect(screen.getByText(mockUpcomingNotification.message)).toBeInTheDocument();
  });

  it('should apply unread notification styles based on category', () => {
    render(NotificationItemComponent());

    const notification = screen.getByTestId('notification-item');

    expect(notification).toHaveClass(UNREAD_NOTIFICATION_STYLES[mockUpcomingNotification.category]);
  });

  it('should applies read notification style when notification is read', () => {
    const readNotification = {
      ...mockUpcomingNotification,
      status: 'Read',
    } as unknown as Notification;

    render(NotificationItemComponent({ notification: readNotification }));

    const notification = screen.getByTestId('notification-item');

    expect(notification).toHaveClass(READ_NOTIFICATION_STYLE);
  });
});
