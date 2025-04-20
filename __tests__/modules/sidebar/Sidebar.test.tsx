import { render, screen } from '@testing-library/react';

import { withRouterAndApolloProvider } from '@/mocks/testMocks';
import Sidebar from '@/modules/sidebar';
import { NavigationLinkLabel } from '@/modules/sidebar/types';
import { AppRoutes } from '@/types/enums';

describe('Sidebar', () => {
  it('should render component without crashing', () => {
    render(withRouterAndApolloProvider(<Sidebar />, AppRoutes.Dashboard));

    expect(screen.getByText(NavigationLinkLabel.Dashboard)).toBeInTheDocument();
    expect(screen.getByText(NavigationLinkLabel.ElevatorManagement)).toBeInTheDocument();
  });
});
