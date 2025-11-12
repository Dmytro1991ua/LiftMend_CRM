import { render, screen } from '@testing-library/react';

import { useToast } from '@/components/ui/use-toast';
import { withApolloProvider } from '@/mocks/testMocks';
import BaseAppMetrics from '@/shared/base-app-metrics';
import { BaseAppMetricsProps } from '@/shared/base-app-metrics/BaseAppMetrics';

jest.mock('@/components/ui/use-toast');

describe('BaseAppMetrics', () => {
  const mockToast = jest.fn();
  const mockMetricsConfig = [
    {
      id: 1,
      metric: 1,
      title: 'Total Repair Jobs',
      icon: <p>Test icon</p>,
      cardClassName: '',
      cardHeaderClassName: '',
      cardTittleClassName: '',
      cardContentClassName: '',
    },
  ];

  beforeEach(() => {
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    metricsConfig: mockMetricsConfig,
    sectionTitle: 'Test Section Title',
    loading: false,
    error: undefined,
  };

  const BaseAppMetricsComponent = (props?: Partial<BaseAppMetricsProps<string, string>>) =>
    withApolloProvider(<BaseAppMetrics {...defaultProps} {...props} />);

  it('should render component without crashing', () => {
    render(BaseAppMetricsComponent());

    expect(screen.getByText('Total Repair Jobs')).toBeInTheDocument();
    expect(screen.getByText('Test Section Title')).toBeInTheDocument();
    expect(screen.getByText('Test icon')).toBeInTheDocument();
  });

  it('should show a loader when metrics are fetching', () => {
    render(BaseAppMetricsComponent({ loading: true }));

    expect(screen.getAllByTestId('bars-loading')).toHaveLength(1);
  });

  it('should show error alert when metrics are failed to fetch', () => {
    render(BaseAppMetricsComponent({ error: 'Error occurred' }));

    expect(mockToast).toHaveBeenCalled();
  });
});
