import { render, screen } from '@testing-library/react';

import { withRouterAndApolloProvider } from '@/mocks/testMocks';
import Sidebar from '@/modules/sidebar';
import { NavigationLinkLabel } from '@/modules/sidebar/types';
import { AppRoutes } from '@/types/enums';
import { SidebarProps } from '@/modules/sidebar/Sidebar';
import userEvent from '@testing-library/user-event';

describe('Sidebar', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const SidebarComponent = (props?: Partial<SidebarProps>) => {
    return withRouterAndApolloProvider(
      <Sidebar isMobileNavOpen={false} onCloseMobileNav={jest.fn()} {...props} />,
      AppRoutes.Dashboard
    );
  };

  it('should render component without crashing', () => {
    render(SidebarComponent());

    expect(screen.getByText(NavigationLinkLabel.Dashboard)).toBeInTheDocument();
    expect(screen.getByText(NavigationLinkLabel.ElevatorManagement)).toBeInTheDocument();
  });

  it('should expand or collapse a sidebar on icon click', async () => {
    render(SidebarComponent());

    const chevronLeftIcon = screen.getByTestId('chevron-left');
    expect(chevronLeftIcon).toBeInTheDocument();

    await userEvent.click(chevronLeftIcon);

    const chevronRightIcon = screen.getByTestId('chevron-right');
    expect(chevronRightIcon).toBeInTheDocument();
  });

  it('should display overlay when mobile nav is open', () => {
    render(SidebarComponent({ isMobileNavOpen: true }));

    const overlay = screen.getByRole('presentation');

    expect(overlay).toHaveClass('opacity-100 visible');
  });

  it('should not display overlay when mobile nav is closed', () => {
    render(SidebarComponent({ isMobileNavOpen: false }));

    const overlay = screen.getByRole('presentation');

    expect(overlay).toHaveClass('opacity-0 invisible');
  });
});
