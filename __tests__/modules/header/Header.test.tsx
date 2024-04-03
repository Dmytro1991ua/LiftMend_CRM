import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { withRouterProvider } from '@/mocks/testMocks';
import Header from '@/modules/header';
import { NavigationLinkLabel } from '@/modules/sidebar/types';
import { AppRoutes } from '@/types/enums';

describe('Header', () => {
  const headerComponent = () => withRouterProvider(<Header />, AppRoutes.Dashboard);

  it('should render component without crashing', () => {
    headerComponent();

    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('should open dropdown on dropdown button click', async () => {
    headerComponent();

    const dropdownButton = screen.getByTestId('dropdown-button');

    fireEvent.click(dropdownButton);

    expect(screen.getByText(NavigationLinkLabel.Profile)).toBeInTheDocument();
    expect(screen.getByText(NavigationLinkLabel.Logout)).toBeInTheDocument();
  });

  it('should navigate to correct routes on dropdown link click', () => {
    headerComponent();

    const dropdownButton = screen.getByTestId('dropdown-button');

    fireEvent.click(dropdownButton);

    const links = screen.getAllByTestId('nav-link');

    const profileLink = links[0];
    const logoutLink = links[1];

    fireEvent.click(profileLink);
    expect(profileLink).toHaveAttribute('href', AppRoutes.Profile);

    fireEvent.click(logoutLink);
    expect(logoutLink).toHaveAttribute('href', AppRoutes.SignIn);
  });
});
