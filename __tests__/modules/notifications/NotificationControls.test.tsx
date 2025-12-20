import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockMarkAllNotificationsAsReadResponse } from '@/mocks/notificationMocks';
import { withApolloProvider } from '@/mocks/testMocks';
import NotificationControls from '@/modules/notifications/notification-controls';
import { NotificationControlsProps } from '@/modules/notifications/notification-controls/NotificationControls';

describe('NotificationControls', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = { areAllNotificationsRead: false };

  const NotificationControlsComponent = (props?: Partial<NotificationControlsProps>) =>
    withApolloProvider(<NotificationControls {...defaultProps} {...props} />, [mockMarkAllNotificationsAsReadResponse]);

  it('should render component without crashing', () => {
    render(NotificationControlsComponent());

    expect(screen.getByTestId('notification-controls')).toBeInTheDocument();
  });

  it('should disables button if all notifications are read', () => {
    render(NotificationControlsComponent({ areAllNotificationsRead: true }));

    const btn = screen.getByRole('button', { name: /Mark All as Read/i });

    expect(btn).toBeDisabled();
  });

  it('should trigger mutation when button clicked', async () => {
    render(NotificationControlsComponent());

    const btn = screen.getByRole('button', { name: /Mark All as Read/i });

    await userEvent.click(btn);

    await waitFor(() => {
      expect(btn).toBeEnabled();
    });
  });
});
