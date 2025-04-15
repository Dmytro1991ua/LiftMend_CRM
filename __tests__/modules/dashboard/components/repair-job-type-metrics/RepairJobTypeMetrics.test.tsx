import { render, screen } from '@testing-library/react';

import { useToast } from '@/components/ui/use-toast';
import { mockDashboardMetricsProps } from '@/mocks/dashboardMetrics';
import { withApolloProvider } from '@/mocks/testMocks';
import RepairJobTypeMetrics from '@/modules/dashboard/components/repair-job-type-metrics';
import { getRepairJobTypeChartDataConfig } from '@/modules/dashboard/components/repair-job-type-metrics/utils';
import { DashboardSectionProps } from '@/modules/dashboard/types';

jest.mock('@/modules/dashboard/components/repair-job-type-metrics/utils');
jest.mock('short-uuid', () => {
  return {
    generate: jest.fn(() => 'mocked-uuid'),
  };
});
jest.mock('@/components/ui/use-toast');

describe('RepairJobTypeMetrics', () => {
  const mockToast = jest.fn();

  beforeEach(() => {
    (getRepairJobTypeChartDataConfig as jest.Mock).mockReturnValue([
      {
        name: 'Repair',
        value: 0,
      },
      {
        name: 'Mentainance',
        value: 0,
      },
      {
        name: 'Installation',
        value: 0,
      },
      {
        name: 'Inspection',
        value: 0,
      },
      {
        name: 'Upgrade',
        value: 0,
      },
      {
        name: 'Emergency',
        value: 0,
      },
      {
        name: 'Routine',
        value: 0,
      },
      {
        name: 'Consultation',
        value: 0,
      },
      {
        name: 'Modernization',
        value: 0,
      },
      {
        name: 'Compliance',
        value: 0,
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

  const RepairJobTypeMetricsComponent = (props?: Partial<DashboardSectionProps>) =>
    withApolloProvider(<RepairJobTypeMetrics {...mockDashboardMetricsProps} {...props} />);

  it('should render component without crashing', () => {
    render(RepairJobTypeMetricsComponent());

    expect(screen.getByText('Repair Job Type Metrics')).toBeInTheDocument();
    expect(screen.getByText('Repair Job Type Overview')).toBeInTheDocument();
    expect(
      screen.getByText(
        'This chart visualizes different repair job types, offering a quick view of their distribution across various categories like Repair, Maintenance, Installation, and more.'
      )
    ).toBeInTheDocument();
  });

  it('should show a loader when dashboard metrics are fetching', () => {
    render(RepairJobTypeMetricsComponent({ loading: true }));

    expect(screen.getByTestId('bars-loading')).toBeInTheDocument();
  });

  it('should show error alert when dashboard metrics are failed to fetch', () => {
    render(RepairJobTypeMetricsComponent({ error: 'Error occurred' }));

    expect(mockToast).toHaveBeenCalled();
  });
});
