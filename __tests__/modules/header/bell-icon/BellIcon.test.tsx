import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { BellIcon } from '@/modules/header/bell-icon';
import { BellIconProps } from '@/modules/header/types';

jest.mock('@/modules/header/bell-badge', () => ({
  __esModule: true,
  BellBadge: ({ unreadNotificationsCount, isLoading }: BellIconProps) => (
    <div data-testid='mock-badge'>{isLoading ? 'loading' : unreadNotificationsCount}</div>
  ),
}));

describe('BellIcon', () => {
  const mockOnClick = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    isLoading: false,
    unreadNotificationsCount: 0,
    onClick: mockOnClick,
  };

  const BellIconComponent = (props?: Partial<BellIconProps>) => <BellIcon {...defaultProps} {...props} />;

  it('should render bell icon', () => {
    render(BellIconComponent());

    expect(screen.getByTestId('bell-icon')).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    render(BellIconComponent({ unreadNotificationsCount: 3 }));

    await userEvent.click(screen.getByTestId('bell-icon'));

    expect(mockOnClick).toHaveBeenCalled();
  });

  it('should set correct aria-label', () => {
    render(BellIconComponent({ unreadNotificationsCount: 3 }));

    expect(screen.getByLabelText('3 unread notifications')).toBeInTheDocument();
  });
});
