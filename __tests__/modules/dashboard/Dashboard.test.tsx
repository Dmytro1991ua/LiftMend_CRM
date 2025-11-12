import { render, screen } from '@testing-library/react';

import { withApolloProvider } from '@/mocks/testMocks';
import Dashboard from '@/modules/dashboard';
import { SectionHeaderTitle } from '@/types/enums';

jest.mock('short-uuid', () => ({
  v4: jest.fn().mockReturnValue('mock-uuid'),
}));

describe('Dashboard', () => {
  const DashboardComponent = () => withApolloProvider(<Dashboard />);

  it('should render component without crashing', () => {
    render(DashboardComponent());
    expect(screen.getByText(SectionHeaderTitle.Dashboard)).toBeInTheDocument();
    expect(screen.getByTestId('base-app-metrics')).toBeInTheDocument();
  });
});
