import { useMemo } from 'react';

import { ChartType } from '@/shared/base-charts/types';

import { DashboardSectionProps, SectionTitle } from '../../types';
import ChartMetrics from '../chart-metrics';

import {
  ADDITIONAL_CHART_CONFIG_FIELDS,
  ELEVATOR_TYPE_CHART_CONFIG,
  ELEVATOR_TYPE_CHART_DESCRIPTION,
  ELEVATOR_TYPE_CHART_TITLE,
} from './constants';
import { getElevatorTypeChartDataConfig } from './utils';

const ElevatorTypeMetrics = ({ className, dashboardMetrics, loading, error }: DashboardSectionProps) => {
  const chartData = useMemo(
    () => getElevatorTypeChartDataConfig(dashboardMetrics.elevatorRecordsMetrics),
    [dashboardMetrics.elevatorRecordsMetrics]
  );

  return (
    <ChartMetrics
      additionalChartConfigFields={ADDITIONAL_CHART_CONFIG_FIELDS}
      cardDetails={{
        title: ELEVATOR_TYPE_CHART_TITLE,
        description: ELEVATOR_TYPE_CHART_DESCRIPTION,
      }}
      chartConfig={ELEVATOR_TYPE_CHART_CONFIG}
      chartData={chartData}
      chartType={ChartType.Pie}
      className={className}
      error={error}
      loading={loading}
      sectionTitle={SectionTitle.ElevatorTypeMetrics}
    />
  );
};

export default ElevatorTypeMetrics;
