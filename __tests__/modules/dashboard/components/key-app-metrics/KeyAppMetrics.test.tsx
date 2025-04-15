import { render, screen } from '@testing-library/react';

import { useToast } from '@/components/ui/use-toast';
import { mockDashboardMetricsProps } from '@/mocks/dashboardMetrics';
import { withApolloProvider } from '@/mocks/testMocks';
import KeyAppMetrics from '@/modules/dashboard/components/key-app-metrics';
import { DashboardSectionProps } from '@/modules/dashboard/types';

jest.mock('@/components/ui/use-toast');

describe('KeyAppMetrics', () => {
  const mockToast = jest.fn();

  beforeEach(() => {
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const KeyAppMetricsComponent = (props?: Partial<DashboardSectionProps>) =>
    withApolloProvider(<KeyAppMetrics {...mockDashboardMetricsProps} {...props} />);

  it('should render component without crashing', () => {
    render(KeyAppMetricsComponent());

    expect(screen.getByText('Total Repair Jobs')).toBeInTheDocument();
    expect(screen.getByText('Total Elevators')).toBeInTheDocument();
    expect(screen.getByText('Total Technicians')).toBeInTheDocument();
    expect(screen.getByText('Ongoing Repair Jobs')).toBeInTheDocument();
    expect(screen.getByText('Completed Today')).toBeInTheDocument();
    expect(screen.getByText('Overdue Repair Jobs')).toBeInTheDocument();
    expect(screen.getByText('Available Technicians')).toBeInTheDocument();
  });

  it('should show a loader when dashboard metrics are fetching', () => {
    render(KeyAppMetricsComponent({ loading: true }));

    expect(screen.getAllByTestId('bars-loading')).toHaveLength(7);
  });

  it('should show error alert when dashboard metrics are failed to fetch', () => {
    render(KeyAppMetricsComponent({ error: 'Error occurred' }));

    expect(mockToast).toHaveBeenCalled();
  });
});
