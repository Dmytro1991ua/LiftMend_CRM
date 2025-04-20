import { fireEvent, render, screen } from '@testing-library/react';

import { withRouterProvider } from '@/mocks/testMocks';
import NavigationLink from '@/modules/sidebar/navigation-link';
import { isRouteActive } from '@/shared/utils';
import { AppRoutes } from '@/types/enums';

jest.mock('@/shared/utils');

describe('NavigationLink', () => {
  const defaultProps = {
    url: AppRoutes.Dashboard,
    icon: <p>Test Icon</p>,
    label: 'Test Label',
    onClose: jest.fn(),
  };

  it('should render component without crashing', () => {
    render(withRouterProvider(<NavigationLink {...defaultProps} />, AppRoutes.Dashboard));

    expect(screen.getByText('Test Icon')).toBeInTheDocument();
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('should apply specific styles to active navigation links', () => {
    (isRouteActive as jest.Mock).mockReturnValue(true);

    render(withRouterProvider(<NavigationLink {...defaultProps} />, AppRoutes.Dashboard));

    const navLink = screen.getByTestId('nav-link');

    expect(navLink).toHaveClass('text-primary bg-background');
  });

  it('should trigger onClose handler when it is provided', () => {
    const mockOnClose = jest.fn();

    render(withRouterProvider(<NavigationLink {...defaultProps} onClose={mockOnClose} />, AppRoutes.Dashboard));

    const navLink = screen.getByTestId('nav-link');

    fireEvent.click(navLink);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
