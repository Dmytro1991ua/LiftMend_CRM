import { render, screen } from '@testing-library/react';

import { withRouterAndApolloProvider } from '@/mocks/testMocks';
import AuthLayout from '@/modules/layout/AuthLayout';
import { AppRoutes } from '@/types/enums';

describe('AuthLayout', () => {
  it('should render component without crashing', () => {
    render(withRouterAndApolloProvider(<AuthLayout>Sign In Component</AuthLayout>, AppRoutes.SignIn));

    expect(screen.getByText('Sign In Component')).toBeInTheDocument();
  });
});
