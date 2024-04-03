import { fireEvent, screen } from '@testing-library/react';

import { withRouterProvider } from '@/mocks/testMocks';
import NavigationLink from '@/modules/sidebar/navigation-link';
import { AppRoutes } from '@/types/enums';
import { isRouteActive } from '@/types/utils';

jest.mock('@/types/utils');

describe('NavigationLink', () => {
  const defaultProps = {
    url: AppRoutes.Dashboard,
    icon: <p>Test Icon</p>,
    label: 'Test Label',
    onClose: jest.fn(),
  };

  it('should render component without crashing', () => {
    withRouterProvider(<NavigationLink {...defaultProps} />, AppRoutes.Dashboard);

    expect(screen.getByText('Test Icon')).toBeInTheDocument();
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('should apply specific styles to active navigation links', () => {
    (isRouteActive as jest.Mock).mockReturnValue(true);

    withRouterProvider(<NavigationLink {...defaultProps} />, AppRoutes.Dashboard);

    const navLink = screen.getByTestId('nav-link');

    expect(navLink).toHaveClass('text-primary bg-background');
  });

  it('should trigger onClose handler when it is provided', () => {
    const mockOnClose = jest.fn();

    withRouterProvider(<NavigationLink {...defaultProps} onClose={mockOnClose} />, AppRoutes.Dashboard);

    const navLink = screen.getByTestId('nav-link');

    fireEvent.click(navLink);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
