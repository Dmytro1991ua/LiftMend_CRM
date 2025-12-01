import { useMemo } from 'react';

import BaseChart from '@/shared/base-charts';
import { ChartData, ChartType } from '@/shared/base-charts/types';

import { ScoreThreshold } from '../types';
import { getScoreThresholdLevel } from '../utils';

export type BaseScoreGaugeChartProps<TLabel extends string> = {
  score?: number | null;
  thresholds: ScoreThreshold<TLabel>[];
  getChartData: (score?: number | null) => ChartData[];
  getChartConfig: (activeColor?: string) => Record<string, unknown>;
};

const BaseScoreGaugeChart = <TLabel extends string>({
  score,
  thresholds,
  getChartData,
  getChartConfig,
}: BaseScoreGaugeChartProps<TLabel>) => {
  const scoreLevel = useMemo(() => getScoreThresholdLevel<TLabel>(score, thresholds), [score, thresholds]);

  const chartData = useMemo(() => getChartData(score), [score, getChartData]);

  const chartConfig = useMemo(() => getChartConfig(scoreLevel?.color), [scoreLevel?.color, getChartConfig]);

  const description = scoreLevel?.tooltipProps?.getTooltipMessage(score as number);

  return (
    <section className='flex flex-col items-center'>
      {description && <h3 className='font-bold text-xl border-b-2 pb-2 mb-2'>{description}</h3>}
      <BaseChart
        additionalChartConfigFields={{ [ChartType.Gauge]: chartConfig }}
        chartType={ChartType.Gauge}
        config={{}}
        data={chartData}
      />
    </section>
  );
};

export default BaseScoreGaugeChart;
