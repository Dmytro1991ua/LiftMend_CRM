import { useMemo } from 'react';

import { Maybe } from 'graphql/jsutils/Maybe';

import BaseChart from '@/shared/base-charts';
import { ChartType } from '@/shared/base-charts/types';

import { getElevatorHealthScoreColor } from '../../utils';

import { getElevatorHealthScoreGaugeChartData, getGaugeChartConfigForHealthScore } from './utils';

type ElevatorHealthScoreGaugeChartProps = {
  healthScore: Maybe<number>;
};

const ElevatorHealthScoreGaugeChart = ({ healthScore }: ElevatorHealthScoreGaugeChartProps) => {
  const healthScoreLevel = useMemo(() => getElevatorHealthScoreColor(healthScore), [healthScore]);

  const elevatorHealthScoreGaugeChartData = useMemo(
    () => getElevatorHealthScoreGaugeChartData(healthScore),
    [healthScore]
  );

  const elevatorHealthScoreGaugeChartConfig = useMemo(
    () => getGaugeChartConfigForHealthScore(healthScoreLevel?.color),
    [healthScoreLevel?.color]
  );

  const healthScoreDescription = healthScoreLevel?.tooltipProps.getTooltipMessage(healthScore as number);

  return (
    <>
      <h3 className='font-bold text-xl border-b-2 pb-2 mb-2'>{healthScoreDescription}</h3>
      <BaseChart
        additionalChartConfigFields={{
          [ChartType.Gauge]: elevatorHealthScoreGaugeChartConfig,
        }}
        chartType={ChartType.Gauge}
        config={{}}
        data={elevatorHealthScoreGaugeChartData}
      />
    </>
  );
};

export default ElevatorHealthScoreGaugeChart;
