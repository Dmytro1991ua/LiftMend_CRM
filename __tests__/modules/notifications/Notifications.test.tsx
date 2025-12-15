import { render, screen } from '@testing-library/react';

import { mockUpcomingNotification } from '@/mocks/notificationMocks';
import Notifications from '@/modules/notifications';
import { getNotificationsLoadStatusView } from '@/modules/notifications/config';
import { useGetNotifications } from '@/modules/notifications/hooks';
import { NotificationItemProps } from '@/modules/notifications/notification-item/NotificationItem';
import { SectionHeaderProps } from '@/shared/section-header/SectionHeader';
import { DataLoadStatus, Notification } from '@/shared/types';

jest.mock('@/modules/notifications/hooks');

jest.mock('@/modules/notifications/notification-item', () => ({
  __esModule: true,
  default: ({ notification }: NotificationItemProps) => (
    <div data-testid='notification-item'>{notification.message}</div>
  ),
}));

jest.mock('@/shared/base-button/go-back-button', () => ({
  __esModule: true,
  default: () => <button data-testid='go-back-button'>Back</button>,
}));

jest.mock('@/shared/section-header', () => ({
  __esModule: true,
  default: ({ title, goBackButton }: SectionHeaderProps) => (
    <div>
      {goBackButton}
      <h1>{title}</h1>
    </div>
  ),
}));

jest.mock('@/modules/notifications/config', () => ({
  getNotificationsLoadStatusView: jest.fn(),
}));

describe('Notifications', () => {
  const mockUseGetNotifications = jest.mocked(useGetNotifications);
  const mockGetNotificationsLoadStatusView = jest.mocked(getNotificationsLoadStatusView);

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
    });

    mockGetNotificationsLoadStatusView.mockReturnValue({
      [DataLoadStatus.Loading]: <div>Loading view</div>,
      [DataLoadStatus.Error]: <div>Error view</div>,
      [DataLoadStatus.Empty]: <div>Empty view</div>,
    });
  });

  it('should render empty view when notifications are empty', () => {
    render(<Notifications />);

    expect(screen.getByText('Empty view')).toBeInTheDocument();
  });

  it('should render loading view when initial loading', () => {
    mockUseGetNotifications.mockReturnValue({
      notifications: [],
      isInitialLoading: true,
      isNotificationsEmpty: false,
      hasMore: false,
      totalNotificationsLength: 0,
      error: undefined,
      onNext: jest.fn(),
    });

    render(<Notifications />);

    expect(screen.getByText('Loading view')).toBeInTheDocument();
  });

  it('should render error view when error exists', () => {
    mockUseGetNotifications.mockReturnValue({
      notifications: [],
      isInitialLoading: false,
      isNotificationsEmpty: false,
      hasMore: false,
      totalNotificationsLength: 0,
      error: 'Error',
      onNext: jest.fn(),
    });

    render(<Notifications />);

    expect(screen.getByText('Error view')).toBeInTheDocument();
  });

  it('should render notifications list when no load status applies', () => {
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
    });

    render(<Notifications />);

    expect(screen.getByText('Messages History')).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByTestId('notification-item')).toBeInTheDocument();
  });
});
