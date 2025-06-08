import { ReactNode } from 'react';

import { render, screen } from '@testing-library/react';
import { ContentType } from 'recharts/types/component/Label';

import { ELEVATOR_STATUS_CHART_CONFIG } from '@/modules/dashboard/components/elevator-status-metrics/constants';
import BasePieChart, { BasePieChartProps } from '@/shared/base-charts/base-pie-chart/BasePieChart';
import { DEFAULT_FALLBACK_MESSAGE } from '@/shared/base-charts/constants';

jest.mock('short-uuid', () => {
  return {
    generate: jest.fn(() => 'mocked-uuid'),
  };
});
jest.mock('recharts', () => ({
  PieChart: ({
    children,
    ...props
  }: {
    children?: ReactNode;
    width?: number;
    height?: number;
    className?: string;
    style?: React.CSSProperties;
  }) => (
    <div data-testid='mock-piechart' {...props}>
      {children}
    </div>
  ),
  Pie: ({
    children,
    label,
    ...props
  }: {
    children?: ReactNode;
    data?: unknown[];
    dataKey?: string;
    nameKey?: string;
    label?: boolean | ReactNode | ((...args: unknown[]) => ReactNode);
  }) => (
    <div data-testid='mock-pie' {...props}>
      {label === true && <div data-testid='mock-label'>Label shown</div>}
      {children}
    </div>
  ),
  Label: ({ content }: { content: ContentType }) => {
    // content can be a function or react node
    if (typeof content === 'function') {
      return <div data-testid='mock-label-content'>{content({ viewBox: { cx: 50, cy: 50 } })}</div>;
    }
    return <div data-testid='mock-label-content'>{content}</div>;
  },
}));
jest.mock('@/components/ui/chart', () => ({
  ChartContainer: ({ children }: { children: React.ReactNode }) => <div data-testid='chart-container'>{children}</div>,
  ChartTooltip: ({ content, cursor }: { content: React.ReactNode | (() => React.ReactNode); cursor: boolean }) => (
    <div data-testid='chart-tooltip'>
      {cursor ? 'cursor-on' : 'cursor-off'}
      {typeof content === 'function' ? content() : content}
    </div>
  ),
  ChartTooltipContent: ({ indicator, hideLabel }: { indicator?: string; hideLabel?: boolean }) => (
    <div data-testid='tooltip-content'>{indicator || (hideLabel ? 'hide' : 'show')}</div>
  ),
  ChartLegend: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className} data-testid='chart-legend'>
      {children}
    </div>
  ),
  ChartLegendContent: ({ nameKey }: { nameKey: string }) => (
    <div data-testid='chart-legend-content'>Legend content for {nameKey}</div>
  ),
}));

describe('BasePieChart', () => {
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

  const defaultProps: BasePieChartProps = {
    config: ELEVATOR_STATUS_CHART_CONFIG,
    data: [
      {
        name: 'Operational',
        value: 0,
        fill: '#22c55e',
      },
      {
        name: 'Out of Service',
        value: 0,
        fill: '#ef4444',
      },
      {
        name: 'Under Mentainance',
        value: 0,
        fill: '#f97316',
      },
    ],
    additionalChartConfigFields: {
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
  };

  const BasePieChartComponent = (props?: Partial<BasePieChartProps>) => <BasePieChart {...defaultProps} {...props} />;

  it('should render fallback message when all data values are 0', () => {
    render(BasePieChartComponent());

    expect(screen.getByText(DEFAULT_FALLBACK_MESSAGE)).toBeInTheDocument();
  });

  it('should render chart container', () => {
    render(
      BasePieChartComponent({
        data: [
          ...defaultProps.data,
          {
            name: 'Paused',
            value: 10,
            fill: '#3b82f6',
          },
        ],
      })
    );

    expect(screen.getByTestId('chart-container')).toBeInTheDocument();
    expect(screen.queryByText(DEFAULT_FALLBACK_MESSAGE)).not.toBeInTheDocument();
  });
});
