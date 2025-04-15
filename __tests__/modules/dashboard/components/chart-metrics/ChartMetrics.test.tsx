import { render, screen } from '@testing-library/react';

import { useToast } from '@/components/ui/use-toast';
import { withApolloProvider } from '@/mocks/testMocks';
import ChartMetrics, { ChartMetricsProps } from '@/modules/dashboard/components/chart-metrics/ChartMetrics';
import { SectionTitle } from '@/modules/dashboard/types';
import { ChartType } from '@/shared/base-charts/types';

jest.mock('short-uuid', () => {
  return {
    generate: jest.fn(() => 'mocked-uuid'),
  };
});

jest.mock('@/components/ui/use-toast');

describe('ChartMetrics', () => {
  const mockToast = jest.fn();

  beforeEach(() => {
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

  const defaultProps: ChartMetricsProps = {
    className: '',
    sectionTitle: SectionTitle.ElevatorStatusMetrics,
    loading: false,
    error: undefined,
    cardDetails: {
      title: 'Test Card Title',
      description: 'Test Card Description',
    },
    chartConfig: {},
    chartType: ChartType.Pie,
    chartData: [
      {
        name: 'Test data',
        value: 10,
      },
    ],
    additionalChartConfigFields: {},
  };

  const ChartMetricsComponent = (props?: Partial<ChartMetricsProps>) =>
    withApolloProvider(<ChartMetrics {...defaultProps} {...props} />);

  it('should render component without crashing', () => {
    render(ChartMetricsComponent());

    expect(screen.getByText('Elevator Status Metrics')).toBeInTheDocument();
    expect(screen.getByText('Test Card Title')).toBeInTheDocument();
    expect(screen.getByText('Test Card Description')).toBeInTheDocument();
  });

  it('should show loading spinner when isLoading is true', () => {
    render(ChartMetricsComponent({ loading: true }));

    expect(screen.getByTestId('bars-loading')).toBeInTheDocument();
  });

  it('should show error alert when error is present', () => {
    render(ChartMetricsComponent({ error: 'Error occurred' }));

    expect(mockToast).toHaveBeenCalled();
  });
});
