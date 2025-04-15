import { render, screen } from '@testing-library/react';

import { useToast } from '@/components/ui/use-toast';
import { mockDashboardMetricsProps } from '@/mocks/dashboardMetrics';
import { withApolloProvider } from '@/mocks/testMocks';
import TechnicianVisibilityMetrics from '@/modules/dashboard/components/technician-visibility-metrics';
import {
  getAdditionalChartConfigFields,
  getTechnicianAssignmentChartDataConfig,
} from '@/modules/dashboard/components/technician-visibility-metrics/utils';
import { DashboardSectionProps } from '@/modules/dashboard/types';

jest.mock('@/modules/dashboard/components/technician-visibility-metrics/utils');
jest.mock('short-uuid', () => {
  return {
    generate: jest.fn(() => 'mocked-uuid'),
  };
});
jest.mock('@/components/ui/use-toast');

describe('TechnicianVisibilityMetrics', () => {
  const mockToast = jest.fn();

  beforeEach(() => {
    (getTechnicianAssignmentChartDataConfig as jest.Mock).mockReturnValue([
      {
        name: 'Available',
        value: 20,
        fill: '#22c55e',
      },
      {
        name: 'Busy',
        value: 2,
        fill: '#f97316',
      },
      {
        name: 'On Leave',
        value: 0,
        fill: '#eab308',
      },
      {
        name: 'Unavailable',
        value: 0,
        fill: '#6b7280',
      },
      {
        name: 'Inactive',
        value: 0,
        fill: '#78716c',
      },
      {
        name: 'Reserved',
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

  const TechnicianVisibilityMetricsComponent = (props?: Partial<DashboardSectionProps>) =>
    withApolloProvider(<TechnicianVisibilityMetrics {...mockDashboardMetricsProps} {...props} />);

  it('should render component without crashing', () => {
    render(TechnicianVisibilityMetricsComponent());

    expect(screen.getByText('Technician Availability Metrics')).toBeInTheDocument();
    expect(screen.getByText('Technician Availability Overview')).toBeInTheDocument();
    expect(
      screen.getByText(
        'This chart shows the distribution of technician availability to help assess resource allocation.'
      )
    ).toBeInTheDocument();
  });

  it('should show a loader when dashboard metrics are fetching', () => {
    render(TechnicianVisibilityMetricsComponent({ loading: true }));

    expect(screen.getByTestId('bars-loading')).toBeInTheDocument();
  });

  it('should show error alert when dashboard metrics are failed to fetch', () => {
    render(TechnicianVisibilityMetricsComponent({ error: 'Error occurred' }));

    expect(mockToast).toHaveBeenCalled();
  });
});
