import { render, screen } from '@testing-library/react';

import { BellBadge } from '@/modules/header/bell-badge';
import { BellIconProps } from '@/modules/header/types';

describe('BellBadge', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    isLoading: false,
    unreadNotificationsCount: 0,
  };

  const BellBadgeComponent = (props?: Partial<BellIconProps>) => <BellBadge {...defaultProps} {...props} />;

  it('should render loader spinner when isLoading is true', () => {
    render(BellBadgeComponent({ isLoading: true }));

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should render nothing when unreadNotificationsCount is 0', () => {
    const { container } = render(BellBadgeComponent());

    expect(container).toHaveTextContent('');
  });

  it('should render correct count (1–9)', () => {
    render(BellBadgeComponent({ unreadNotificationsCount: 5 }));

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should render "9+" when count is larger than 9', () => {
    render(BellBadgeComponent({ unreadNotificationsCount: 12 }));

    expect(screen.getByText('9+')).toBeInTheDocument();
  });
});
