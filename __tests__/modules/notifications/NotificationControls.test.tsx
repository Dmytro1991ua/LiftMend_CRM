import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockMarkAllNotificationsAsReadResponse } from '@/mocks/notificationMocks';
import { withApolloProvider } from '@/mocks/testMocks';
import NotificationControls from '@/modules/notifications/notification-controls';
import { NotificationsState } from '@/modules/notifications/type';

describe('NotificationControls', () => {
  const mockOnSetNotificationsPageStoredState = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    areAllNotificationsRead: false,
    notificationsPageStoredState: {},
    onSetNotificationsPageStoredState: mockOnSetNotificationsPageStoredState,
  };

  const NotificationControlsComponent = (
    props?: Partial<
      Pick<
        NotificationsState,
        'areAllNotificationsRead' | 'notificationsPageStoredState' | 'onSetNotificationsPageStoredState'
      >
    >
  ) =>
    withApolloProvider(<NotificationControls {...defaultProps} {...props} />, [mockMarkAllNotificationsAsReadResponse]);

  it('should render component without crashing', () => {
    render(NotificationControlsComponent());

    expect(screen.getByTestId('notification-controls')).toBeInTheDocument();
    expect(screen.getByText('Filters')).toBeInTheDocument();
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

  it('should call onSetNotificationsPageStoredState when a filter is changed', async () => {
    render(NotificationControlsComponent());

    const filtersBtn = screen.getByText('Filters');

    await userEvent.click(filtersBtn);

    const portal = within(document.body);

    const categoryFilter = await portal.findByText('Category');

    await userEvent.click(categoryFilter);

    const overdueOption = screen.getByText('Overdue');

    await userEvent.click(overdueOption);

    expect(mockOnSetNotificationsPageStoredState).toHaveBeenCalled();
  });
});
