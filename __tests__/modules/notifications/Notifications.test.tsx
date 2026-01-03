import { render, screen } from '@testing-library/react';

import { mockUpcomingNotification } from '@/mocks/notificationMocks';
import Notifications from '@/modules/notifications';
import { useGetNotifications } from '@/modules/notifications/hooks';
import { NotificationItemProps } from '@/modules/notifications/notification-item/NotificationItem';
import { Notification } from '@/shared/types';

jest.mock('@/modules/notifications/hooks');

jest.mock('@/modules/notifications/notification-item', () => ({
  __esModule: true,
  default: ({ notification }: NotificationItemProps) => (
    <div data-testid='notification-item'>{notification.message}</div>
  ),
}));

jest.mock('@/shared/paginated-list-page', () => ({
  __esModule: true,
  default: ({ children, sectionTitle }: { children: React.ReactNode; sectionTitle: string }) => (
    <div>
      <h1>{sectionTitle}</h1>
      {children}
    </div>
  ),
}));

jest.mock('@/modules/notifications/config', () => ({
  getNotificationsLoadStatusView: jest.fn(),
}));

describe('Notifications', () => {
  const mockUseGetNotifications = jest.mocked(useGetNotifications);

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    mockUseGetNotifications.mockReturnValue({
      notifications: [],
      isInitialLoading: false,
      isNotificationsEmpty: true,
      hasMore: false,
      totalNotificationsLength: 0,
      error: undefined,
      onNext: jest.fn(),
      areAllNotificationsRead: false,
      notificationsPageStoredState: {},
      onSetNotificationsPageStoredState: jest.fn(),
    });
  });

  it('should render page title', () => {
    render(<Notifications />);

    expect(screen.getByText('Messages History')).toBeInTheDocument();
  });

  it('should render notifications when present', () => {
    mockUseGetNotifications.mockReturnValue({
      notifications: [
        {
          label: 'Today',
          items: [mockUpcomingNotification as unknown as Notification],
        },
      ],
      isInitialLoading: false,
      isNotificationsEmpty: false,
      hasMore: false,
      totalNotificationsLength: 1,
      error: undefined,
      onNext: jest.fn(),
      areAllNotificationsRead: false,
      notificationsPageStoredState: {},
      onSetNotificationsPageStoredState: jest.fn(),
    });

    render(<Notifications />);

    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByTestId('notification-item')).toBeInTheDocument();
  });
});
