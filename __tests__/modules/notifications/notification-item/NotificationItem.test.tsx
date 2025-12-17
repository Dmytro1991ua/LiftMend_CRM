import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockUpcomingNotification } from '@/mocks/notificationMocks';
import {
  DEFAULT_BADGE_STYLE,
  NOTIFICATION_BADGE_STYLES,
  READ_NOTIFICATION_STYLE,
  UNREAD_NOTIFICATION_STYLES,
} from '@/modules/notifications/constants';
import { useMarkNotificationAsRead } from '@/modules/notifications/hooks/useMarkNotificationAsRead';
import NotificationItem, { NotificationItemProps } from '@/modules/notifications/notification-item/NotificationItem';
import { Notification } from '@/shared/types';

jest.mock('@/modules/notifications/hooks/useMarkNotificationAsRead', () => ({
  useMarkNotificationAsRead: jest.fn(),
}));

describe('NotificationItem', () => {
  const mockOnMarkNotificationAsRead = jest.fn();
  const mockReadNotification = {
    ...mockUpcomingNotification,
    status: 'Read',
  } as unknown as Notification;

  beforeEach(() => {
    (useMarkNotificationAsRead as jest.Mock).mockReturnValue({
      loading: false,
      onMarkNotificationAsRead: mockOnMarkNotificationAsRead,
    });
  });

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
    render(NotificationItemComponent({ notification: mockReadNotification }));

    const notification = screen.getByTestId('notification-item');

    expect(notification).toHaveClass(READ_NOTIFICATION_STYLE);
  });

  it('should render colored badge for unread notification', () => {
    render(NotificationItemComponent());

    const badge = screen.getByText(mockUpcomingNotification.category);

    expect(badge).toHaveClass(NOTIFICATION_BADGE_STYLES[mockUpcomingNotification.category]);
  });

  it('should render gray badge for read notification', () => {
    render(NotificationItemComponent({ notification: mockReadNotification }));

    const badge = screen.getByText(mockUpcomingNotification.category);

    expect(badge).toHaveClass(DEFAULT_BADGE_STYLE);
  });

  it('should call onMarkNotificationAsRead with correct arguments on click (Unread)', async () => {
    render(NotificationItemComponent());

    await userEvent.click(screen.getByTestId('notification-item'));

    expect(mockOnMarkNotificationAsRead).toHaveBeenCalledWith(mockUpcomingNotification.id, true);
  });

  it('should call onMarkNotificationAsRead with correct arguments on click (Read)', async () => {
    render(NotificationItemComponent({ notification: mockReadNotification }));

    await userEvent.click(screen.getByTestId('notification-item'));

    expect(mockOnMarkNotificationAsRead).toHaveBeenCalledWith(mockUpcomingNotification.id, false);
  });
});
