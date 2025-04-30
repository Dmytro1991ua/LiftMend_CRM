import { fireEvent, render, screen } from '@testing-library/react';

import { withRouterAndApolloProvider } from '@/mocks/testMocks';
import { mockUserResponse } from '@/mocks/userMocks';
import Header from '@/modules/header';
import { NavigationLinkLabel } from '@/modules/sidebar/types';
import { AppRoutes } from '@/types/enums';

describe('Header', () => {
  const mockOnBurgerIconClick = jest.fn();

  const defaultProps = {
    onBurgerIconClick: mockOnBurgerIconClick,
  };

  const headerComponent = () =>
    withRouterAndApolloProvider(<Header {...defaultProps} />, AppRoutes.Dashboard, [mockUserResponse]);

  it('should render component without crashing', () => {
    render(headerComponent());

    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('should open dropdown on dropdown button click', async () => {
    render(headerComponent());

    const dropdownButton = screen.getByTestId('dropdown-button');

    fireEvent.click(dropdownButton);

    expect(screen.getByText(NavigationLinkLabel.Profile)).toBeInTheDocument();
    expect(screen.getByText(NavigationLinkLabel.Logout)).toBeInTheDocument();
  });

  it('should navigate to correct routes on dropdown link click', () => {
    render(headerComponent());

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

  it('should open sidenav on mobile screen by clicking to burger icon', () => {
    render(headerComponent());

    const burgerButton = screen.getByTestId('burger-button');

    fireEvent.click(burgerButton);

    expect(mockOnBurgerIconClick).toHaveBeenCalled();
  });
});
