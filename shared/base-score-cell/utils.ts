import { ChartData } from '../base-charts/types';

import { ScoreThreshold, ScoreTooltipMessageParams } from './types';

export const getScoreThresholdLevel = <TLabel extends string>(
  score: number | null | undefined,
  thresholds: ScoreThreshold<TLabel>[]
): ScoreThreshold<TLabel> | null => {
  if (score == null) return null;

  const level = thresholds.find(({ value }) => score >= value);

  return level ? { ...level, value: score } : null;
};

export const getScoreTooltipMessage = <TLabel extends string, TDescription extends string>({
  score,
  title,
  label,
  description,
}: ScoreTooltipMessageParams<TLabel, TDescription>) => `${title}: ${score} – ${label}. ${description}`;

export const getScoreGaugeChartData = (score?: number | null): ChartData[] => {
  if (score == null) return [];

  return [{ name: 'Score', value: score }];
};

export const getScoreGaugeChartConfig = <TLabel extends string>(
  thresholds: ScoreThreshold<TLabel>[],
  needleColor?: string
) => {
  return {
    nrOfLevels: thresholds.length,
    colors: thresholds.map(({ color }) => color).reverse(),
    needleColor,
    needleBaseColor: needleColor,
    style: { width: 500, height: 200 },
    hideText: true,
  };
};
