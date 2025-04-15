import { render, screen } from '@testing-library/react';

import { useToast } from '@/components/ui/use-toast';
import { mockDashboardMetricsProps } from '@/mocks/dashboardMetrics';
import { withApolloProvider } from '@/mocks/testMocks';
import RepairJobStatusMetrics from '@/modules/dashboard/components/repair-job-status-metrics';
import { getRepairJobStatusChartDataConfig } from '@/modules/dashboard/components/repair-job-status-metrics/utils';
import { DashboardSectionProps } from '@/modules/dashboard/types';

jest.mock('@/modules/dashboard/components/repair-job-status-metrics/utils');
jest.mock('short-uuid', () => {
  return {
    generate: jest.fn(() => 'mocked-uuid'),
  };
});
jest.mock('@/components/ui/use-toast');

describe('RepairJobStatusMetrics', () => {
  const mockToast = jest.fn();

  beforeEach(() => {
    (getRepairJobStatusChartDataConfig as jest.Mock).mockReturnValue([
      {
        name: 'Scheduled',
        value: 0,
        fill: '#3b82f6',
      },
      {
        name: 'In Progress',
        value: 0,
        fill: '#f97316',
      },
      {
        name: 'Completed',
        value: 0,
        fill: '#22c55e',
      },
      {
        name: 'On Hold',
        value: 0,
        fill: '#eab308',
      },
      {
        name: 'Cancelled',
        value: 0,
        fill: '#ef4444',
      },
    ]);

    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));

    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const RepairJobStatusMetricsComponent = (props?: Partial<DashboardSectionProps>) =>
    withApolloProvider(<RepairJobStatusMetrics {...mockDashboardMetricsProps} {...props} />);

  it('should render component without crashing', () => {
    render(RepairJobStatusMetricsComponent());

    expect(screen.getByText('Repair Job Status Metrics')).toBeInTheDocument();
    expect(screen.getByText('Repair Job Status Overview')).toBeInTheDocument();
    expect(
      screen.getByText(
        'This chart highlights repair job statuses, offering a quick overview of their progress through different stages.'
      )
    ).toBeInTheDocument();
  });

  it('should show a loader when dashboard metrics are fetching', () => {
    render(RepairJobStatusMetricsComponent({ loading: true }));

    expect(screen.getByTestId('bars-loading')).toBeInTheDocument();
  });

  it('should show error alert when dashboard metrics are failed to fetch', () => {
    render(RepairJobStatusMetricsComponent({ error: 'Error occurred' }));

    expect(mockToast).toHaveBeenCalled();
  });
});
