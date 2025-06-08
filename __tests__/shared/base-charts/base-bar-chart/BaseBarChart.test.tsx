import { render, screen } from '@testing-library/react';
import { ContentType } from 'recharts/types/component/DefaultLegendContent';

import { REPAIR_JOB_PRIORITY_CHART_CONFIG } from '@/modules/dashboard/components/repair-job-priority-metrics/constants';
import BaseBarChart, { BaseBarChartProps } from '@/shared/base-charts/base-bar-chart/BaseBarChart';
import { DEFAULT_FALLBACK_MESSAGE } from '@/shared/base-charts/constants';

jest.mock('short-uuid', () => {
  return {
    generate: jest.fn(() => 'mocked-uuid'),
  };
});

jest.mock('@/components/ui/chart', () => ({
  ChartContainer: ({ children }: { children: React.ReactNode }) => <div data-testid='chart-container'>{children}</div>,
  ChartTooltip: ({ content, cursor }: { content: ContentType; cursor: boolean }) => (
    <div data-testid='chart-tooltip'>
      {cursor ? 'cursor-on' : 'cursor-off'}
      {content}
    </div>
  ),
  ChartTooltipContent: ({ indicator }: { indicator: string }) => <div data-testid='tooltip-content'>{indicator}</div>,
}));

describe('BaseBarChart', () => {
  beforeEach(() => {
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps: BaseBarChartProps = {
    config: REPAIR_JOB_PRIORITY_CHART_CONFIG,
    data: [
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
    ],
    additionalChartConfigFields: {
      dataKey: 'value',
      nameKey: 'name',
      radius: 15,
      isXAxisHidden: true,
      isYAxisHidden: true,
      barChartMargin: {
        top: 30,
        bottom: 30,
        right: 25,
      },
      barSettings: {
        barCategoryGap: '20%',
      },
      layout: 'vertical',
      secondaryLabelColor: '#6b7280',
      primaryLabelClassName: 'font-bold',
    },
  };

  const BaseBarChartComponent = (props?: Partial<BaseBarChartProps>) => <BaseBarChart {...defaultProps} {...props} />;

  it('should render fallback message when all data values are 0', () => {
    render(BaseBarChartComponent());

    expect(screen.getByText(DEFAULT_FALLBACK_MESSAGE)).toBeInTheDocument();
  });

  it('should render chart container', () => {
    render(
      BaseBarChartComponent({
        data: [
          ...defaultProps.data,
          {
            name: 'Very High',
            value: 2,
            fill: '#ef224',
          },
        ],
      })
    );

    expect(screen.getByTestId('chart-container')).toBeInTheDocument();
    expect(screen.queryByText(DEFAULT_FALLBACK_MESSAGE)).not.toBeInTheDocument();
  });
});
