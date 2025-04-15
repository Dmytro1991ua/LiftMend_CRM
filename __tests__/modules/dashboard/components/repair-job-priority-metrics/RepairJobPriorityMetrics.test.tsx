import { render, screen } from '@testing-library/react';

import { useToast } from '@/components/ui/use-toast';
import { mockDashboardMetricsProps } from '@/mocks/dashboardMetrics';
import { withApolloProvider } from '@/mocks/testMocks';
import RepairJobPriorityMetrics from '@/modules/dashboard/components/repair-job-priority-metrics';
import { getRepairJobPriorityChartDataConfig } from '@/modules/dashboard/components/repair-job-priority-metrics/utils';
import { DashboardSectionProps } from '@/modules/dashboard/types';

jest.mock('@/modules/dashboard/components/repair-job-priority-metrics/utils');
jest.mock('short-uuid', () => {
  return {
    generate: jest.fn(() => 'mocked-uuid'),
  };
});
jest.mock('@/components/ui/use-toast');

describe('RepairJobPriorityMetrics', () => {
  const mockToast = jest.fn();

  beforeEach(() => {
    (getRepairJobPriorityChartDataConfig as jest.Mock).mockReturnValue([
      {
        name: 'Low',
        value: 0,
        fill: '#22c55e',
      },
      {
        name: 'Medium',
        value: 0,
        fill: '#eab308',
      },
      {
        name: 'High',
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

  const RepairJobPriorityMetricsComponent = (props?: Partial<DashboardSectionProps>) =>
    withApolloProvider(<RepairJobPriorityMetrics {...mockDashboardMetricsProps} {...props} />);

  it('should render component without crashing', () => {
    render(RepairJobPriorityMetricsComponent());

    expect(screen.getByText('Repair Job Priority Metrics')).toBeInTheDocument();
    expect(screen.getByText('Repair Job Priority Overview')).toBeInTheDocument();
    expect(
      screen.getByText(
        'This chart highlights repair job priorities, providing a quick view of jobs categorized as Low, Medium, or High.'
      )
    ).toBeInTheDocument();
  });

  it('should show a loader when dashboard metrics are fetching', () => {
    render(RepairJobPriorityMetricsComponent({ loading: true }));

    expect(screen.getByTestId('bars-loading')).toBeInTheDocument();
  });

  it('should show error alert when dashboard metrics are failed to fetch', () => {
    render(RepairJobPriorityMetricsComponent({ error: 'Error occurred' }));

    expect(mockToast).toHaveBeenCalled();
  });
});
