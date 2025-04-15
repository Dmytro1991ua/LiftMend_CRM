import { render, screen } from '@testing-library/react';

import { useToast } from '@/components/ui/use-toast';
import { mockDashboardMetricsProps } from '@/mocks/dashboardMetrics';
import { withApolloProvider } from '@/mocks/testMocks';
import ElevatorStatusMetrics from '@/modules/dashboard/components/elevator-status-metrics';
import {
  getAdditionalChartConfigFields,
  getElevatorStatusChartDataConfig,
} from '@/modules/dashboard/components/elevator-status-metrics/utils';
import { DashboardSectionProps } from '@/modules/dashboard/types';

jest.mock('@/modules/dashboard/components/elevator-status-metrics/utils');
jest.mock('short-uuid', () => {
  return {
    generate: jest.fn(() => 'mocked-uuid'),
  };
});
jest.mock('@/components/ui/use-toast');

describe('ElevatorStatusMetrics', () => {
  const mockToast = jest.fn();

  beforeEach(() => {
    (getElevatorStatusChartDataConfig as jest.Mock).mockReturnValue([
      {
        name: 'Operational',
        value: 72,
        fill: '#22c55e',
      },
      {
        name: 'Out of Service',
        value: 0,
        fill: '#ef4444',
      },
      {
        name: 'Under Mentainance',
        value: 2,
        fill: '#f97316',
      },
      {
        name: 'Paused',
        value: 0,
        fill: '#3b82f6',
      },
    ]);

    (getAdditionalChartConfigFields as jest.Mock).mockReturnValue({
      Pie: {
        dataKey: 'value',
        nameKey: 'name',
        innerRadius: 70,
        outerRadius: 110,
        hasLayerLabel: false,
        chartTitle: 'Total Elevators',
        chartTotalValue: 74,
        shouldShowLabel: true,
        shouldShowChartLegend: true,
        chartLegendClassName: 'hidden lg:flex translate-y-1 flex-wrap gap-2 [&>*]:basis-1/3 [&>*]:justify-center',
      },
    });

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

  const ElevatorStatusMetricsComponent = (props?: Partial<DashboardSectionProps>) =>
    withApolloProvider(<ElevatorStatusMetrics {...mockDashboardMetricsProps} {...props} />);

  it('should render component without crashing', () => {
    render(ElevatorStatusMetricsComponent());

    expect(screen.getByText('Elevator Status Metrics')).toBeInTheDocument();
    expect(screen.getByText('Elevator Status Overview')).toBeInTheDocument();
    expect(
      screen.getByText(
        'This chart highlights elevator statuses, offering a quick view of operational and maintenance conditions.'
      )
    ).toBeInTheDocument();
  });

  it('should show a loader when dashboard metrics are fetching', () => {
    render(ElevatorStatusMetricsComponent({ loading: true }));

    expect(screen.getByTestId('bars-loading')).toBeInTheDocument();
  });

  it('should show error alert when dashboard metrics are failed to fetch', () => {
    render(ElevatorStatusMetricsComponent({ error: 'Error occurred' }));

    expect(mockToast).toHaveBeenCalled();
  });
});
