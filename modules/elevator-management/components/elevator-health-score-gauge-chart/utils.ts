import { Maybe } from 'graphql/jsutils/Maybe';

import { ChartData } from '@/shared/base-charts/types';

import { ELEVATOR_HEALTH_SCORE_THRESHOLDS } from '../health-score-cell/configs';

export const getElevatorHealthScoreGaugeChartData = (healthScore: Maybe<number>): ChartData[] => {
  if (healthScore == null) return [];

  return [{ name: 'HealthScore', value: healthScore }];
};

export const getGaugeChartConfigForHealthScore = (color?: string) => {
  return {
    nrOfLevels: ELEVATOR_HEALTH_SCORE_THRESHOLDS.length,
    colors: ELEVATOR_HEALTH_SCORE_THRESHOLDS.map(({ color }) => color).reverse(),
    needleColor: color,
    needleBaseColor: color,
    style: { width: 500, height: 200 },
    hideText: true,
  };
};
