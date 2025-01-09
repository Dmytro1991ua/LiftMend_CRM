import { render, screen } from '@testing-library/react';

import { MockProviderHook } from '@/mocks/testMocks';
import Dashboard from '@/modules/dashboard';
import { SectionHeaderTitle } from '@/types/enums';

describe('Dashboard', () => {
  const DashboardComponent = () => (
    <MockProviderHook mocks={[]}>
      <Dashboard />
    </MockProviderHook>
  );

  it('should render component without crashing', () => {
    render(<DashboardComponent />);
    expect(screen.getByText(SectionHeaderTitle.Dashboard)).toBeInTheDocument();
    expect(screen.getByTestId('key-app-metrics')).toBeInTheDocument();
  });
});
