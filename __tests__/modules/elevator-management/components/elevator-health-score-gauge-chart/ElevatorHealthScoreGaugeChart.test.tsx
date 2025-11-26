import { render, screen } from '@testing-library/react';

import { ElevatorHealthScoreGaugeChart } from '@/modules/elevator-management/components/elevator-health-score-gauge-chart';
import {
  getElevatorHealthScoreGaugeChartData,
  getGaugeChartConfigForHealthScore,
} from '@/modules/elevator-management/components/elevator-health-score-gauge-chart/utils';
import { getElevatorHealthScoreColor } from '@/modules/elevator-management/utils';
import { BaseChartProps, ChartType } from '@/shared/base-charts/types';

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

jest.mock('@/modules/elevator-management/utils', () => ({
  getElevatorHealthScoreColor: jest.fn(),
}));

jest.mock('@/modules/elevator-management/components/elevator-health-score-gauge-chart/utils', () => ({
  ...jest.requireActual('@/modules/elevator-management/components/elevator-health-score-gauge-chart/utils'),
  getElevatorHealthScoreGaugeChartData: jest.fn(),
  getGaugeChartConfigForHealthScore: jest.fn(),
}));

describe('ElevatorHealthScoreGaugeChart', () => {
  const mockHealthScore = 75;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render Gauge Chart and elevator health score description', () => {
    (getElevatorHealthScoreColor as jest.Mock).mockReturnValue({
      color: 'yellow',
      tooltipProps: {
        getTooltipMessage: (value: number) => `Health score is ${value}`,
      },
    });

    (getElevatorHealthScoreGaugeChartData as jest.Mock).mockReturnValue([
      { name: 'HealthScore', value: mockHealthScore },
    ]);
    (getGaugeChartConfigForHealthScore as jest.Mock).mockReturnValue({
      nrOfLevels: 3,
    });

    render(<ElevatorHealthScoreGaugeChart healthScore={mockHealthScore} />);

    expect(screen.getByText(`Health score is ${mockHealthScore}`)).toBeInTheDocument();

    const chart = screen.getByTestId('base-chart');

    expect(chart).toHaveAttribute('data-chart-type', ChartType.Gauge);
    expect(chart).toHaveAttribute('data-data', JSON.stringify([{ name: 'HealthScore', value: mockHealthScore }]));
    expect(getElevatorHealthScoreColor).toHaveBeenCalledWith(mockHealthScore);
    expect(getElevatorHealthScoreGaugeChartData).toHaveBeenCalledWith(mockHealthScore);
    expect(getGaugeChartConfigForHealthScore).toHaveBeenCalledWith('yellow');
  });
});
