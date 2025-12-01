import { render, screen } from '@testing-library/react';

import { BaseChartProps, ChartData, ChartType } from '@/shared/base-charts/types';
import BaseScoreGaugeChart from '@/shared/base-score-cell/base-score-gauge-chart/BaseScoreGaugeChart';
import { ScoreThreshold } from '@/shared/base-score-cell/types';

jest.mock('@/shared/base-charts', () => ({
  __esModule: true,
  default: ({ chartType, data, additionalChartConfigFields }: BaseChartProps) => (
    <div
      data-chart-type={chartType}
      data-config={JSON.stringify(additionalChartConfigFields)}
      data-data={JSON.stringify(data)}
      data-testid='base-chart'
    />
  ),
}));

describe('BaseScoreGaugeChart', () => {
  const mockScore = 75;

  const mockThresholds: ScoreThreshold<string>[] = [
    {
      value: 90,
      label: 'Excellent',
      color: 'green',
      activeDots: 3,
      classes: { background: 'bg-green-500', text: '', border: '' },
      tooltipProps: {
        id: 'Excellent',
        getTooltipMessage: (value: number) => `Score is ${value} – Excellent`,
      },
    },
    {
      value: 70,
      label: 'Good',
      color: 'yellow',
      activeDots: 2,
      classes: { background: 'bg-yellow-500', text: '', border: '' },
      tooltipProps: {
        id: 'Good',
        getTooltipMessage: (value: number) => `Score is ${value} – Good`,
      },
    },
  ];

  const mockGetChartData = jest.fn((score?: number | null) => [{ name: 'Score', value: score ?? 0 }] as ChartData[]);

  const mockGetChartConfig = jest.fn((activeColor?: string) => ({
    nrOfLevels: mockThresholds.length,
    colors: mockThresholds.map((t) => t.color).reverse(),
    needleColor: activeColor,
    needleBaseColor: activeColor,
    hideText: true,
  }));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders chart and description correctly', () => {
    render(
      <BaseScoreGaugeChart
        getChartConfig={mockGetChartConfig}
        getChartData={mockGetChartData}
        score={mockScore}
        thresholds={mockThresholds}
      />
    );

    expect(screen.getByText(`Score is ${mockScore} – Good`)).toBeInTheDocument();
    const chart = screen.getByTestId('base-chart');
    expect(chart).toHaveAttribute('data-chart-type', ChartType.Gauge);
    expect(chart).toHaveAttribute('data-data', JSON.stringify([{ name: 'Score', value: mockScore }]));
    expect(mockGetChartData).toHaveBeenCalledWith(mockScore);
    expect(mockGetChartConfig).toHaveBeenCalledWith('yellow');
  });

  it('renders placeholder when score is null', () => {
    render(
      <BaseScoreGaugeChart
        getChartConfig={mockGetChartConfig}
        getChartData={mockGetChartData}
        score={null}
        thresholds={mockThresholds}
      />
    );

    expect(mockGetChartData).toHaveBeenCalledWith(null);
    expect(mockGetChartConfig).toHaveBeenCalledWith(undefined);
    const chart = screen.getByTestId('base-chart');
    expect(chart).toHaveAttribute('data-chart-type', ChartType.Gauge);
    expect(chart).toHaveAttribute('data-data', JSON.stringify([{ name: 'Score', value: 0 }]));
  });
});
