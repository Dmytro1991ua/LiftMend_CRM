import { render, screen } from '@testing-library/react';

import { withRouterAndApolloProvider } from '@/mocks/testMocks';
import Profile from '@/modules/profile';
import { AppRoutes, SectionHeaderTitle } from '@/types/enums';

describe('Profile', () => {
  it('should render component without crashing', () => {
    render(withRouterAndApolloProvider(<Profile />, AppRoutes.Profile));

    expect(screen.getByText(SectionHeaderTitle.Profile)).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });
});
