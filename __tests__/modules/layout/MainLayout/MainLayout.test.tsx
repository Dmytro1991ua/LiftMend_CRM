import { render, screen } from '@testing-library/react';

import { withRouterAndApolloProvider } from '@/mocks/testMocks';
import MainLayout from '@/modules/layout/MainLayout';
import { NavigationLinkLabel } from '@/modules/sidebar/types';
import { AppRoutes } from '@/types/enums';

describe('MainLayout', () => {
  it('should render component without crashing', () => {
    render(withRouterAndApolloProvider(<MainLayout />, AppRoutes.Dashboard));

    expect(screen.getByText(NavigationLinkLabel.Dashboard)).toBeInTheDocument();
    expect(screen.getByText(NavigationLinkLabel.ElevatorManagement)).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });
});
