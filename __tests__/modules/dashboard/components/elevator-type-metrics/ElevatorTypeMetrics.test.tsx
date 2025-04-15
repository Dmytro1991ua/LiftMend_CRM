import { render, screen } from '@testing-library/react';

import { useToast } from '@/components/ui/use-toast';
import { mockDashboardMetricsProps } from '@/mocks/dashboardMetrics';
import { withApolloProvider } from '@/mocks/testMocks';
import ElevatorTypeMetrics from '@/modules/dashboard/components/elevator-type-metrics';
import { getElevatorTypeChartDataConfig } from '@/modules/dashboard/components/elevator-type-metrics/utils';
import { DashboardSectionProps } from '@/modules/dashboard/types';

jest.mock('@/modules/dashboard/components/elevator-type-metrics/utils');
jest.mock('short-uuid', () => {
  return {
    generate: jest.fn(() => 'mocked-uuid'),
  };
});
jest.mock('@/components/ui/use-toast');

describe('ElevatorTypeMetrics', () => {
  const mockToast = jest.fn();

  beforeEach(() => {
    (getElevatorTypeChartDataConfig as jest.Mock).mockReturnValue([
      {
        name: 'Passenger',
        value: 19,
        fill: '#2196F3',
      },
      {
        name: 'Freight',
        value: 10,
        fill: '#8E24AA',
      },
      {
        name: 'Service',
        value: 6,
        fill: '#009688',
      },
      {
        name: 'Home',
        value: 12,
        fill: '#FF5722',
      },
      {
        name: 'Luxury High Speed',
        value: 5,
        fill: '#FFD700',
      },
      {
        name: 'Vehicle Parking',
        value: 5,
        fill: '#3F51B5',
      },
      {
        name: 'Specialty',
        value: 9,
        fill: '#795548',
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

  const ElevatorTypeMetricsComponent = (props?: Partial<DashboardSectionProps>) =>
    withApolloProvider(<ElevatorTypeMetrics {...mockDashboardMetricsProps} {...props} />);

  it('should render component without crashing', () => {
    render(ElevatorTypeMetricsComponent());

    expect(screen.getByText('Elevator Type Metrics')).toBeInTheDocument();
    expect(screen.getByText('Elevator Type Categorization Overview')).toBeInTheDocument();
    expect(
      screen.getByText(
        'This chart categorizes elevators into types such as Passenger, Freight, Home,etc., showcasing their distribution based on function and use.'
      )
    ).toBeInTheDocument();
  });

  it('should show a loader when dashboard metrics are fetching', () => {
    render(ElevatorTypeMetricsComponent({ loading: true }));

    expect(screen.getByTestId('bars-loading')).toBeInTheDocument();
  });

  it('should show error alert when dashboard metrics are failed to fetch', () => {
    render(ElevatorTypeMetricsComponent({ error: 'Error occurred' }));

    expect(mockToast).toHaveBeenCalled();
  });
});
