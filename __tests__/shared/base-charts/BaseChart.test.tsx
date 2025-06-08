import { render, screen } from '@testing-library/react';

import { ELEVATOR_STATUS_CHART_CONFIG } from '@/modules/dashboard/components/elevator-status-metrics/constants';
import BaseChart from '@/shared/base-charts';
import { BaseChartProps, ChartType } from '@/shared/base-charts/types';

jest.mock('short-uuid', () => {
  return {
    generate: jest.fn(() => 'mocked-uuid'),
  };
});

describe('BaseChart', () => {
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

  const defaultProps: BaseChartProps = {
    config: ELEVATOR_STATUS_CHART_CONFIG,
    data: [
      {
        name: 'Operational',
        value: 10,
        fill: '#22c55e',
      },
      {
        name: 'Out of Service',
        value: 2,
        fill: '#ef4444',
      },
      {
        name: 'Under Mentainance',
        value: 3,
        fill: '#f97316',
      },
    ],
    additionalChartConfigFields: {
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
    },
    chartType: ChartType.Pie,
  };

  const BaseChartComponent = (props?: Partial<BaseChartProps>) => <BaseChart {...defaultProps} {...props} />;

  it('should render Pie chart based on chartType key', () => {
    render(BaseChartComponent());

    expect(screen.getByTestId('pie-chart-container')).toBeInTheDocument();
    expect(screen.queryByTestId('bar-chart-container')).not.toBeInTheDocument();
  });

  it('should render Bar chart based on chartType key', () => {
    render(
      BaseChartComponent({
        chartType: ChartType.Bar,
        additionalChartConfigFields: {
          Bar: {
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
        },
      })
    );

    expect(screen.getByTestId('bar-chart-container')).toBeInTheDocument();
    expect(screen.queryByTestId('pie-chart-container')).not.toBeInTheDocument();
  });
});
