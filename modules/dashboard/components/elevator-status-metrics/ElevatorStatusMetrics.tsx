import { useMemo } from 'react';

import { ChartType } from '@/shared/base-charts/types';

import { DashboardSectionProps, SectionTitle } from '../../types';
import ChartMetrics from '../chart-metrics';

import {
  ELEVATOR_STATUS_CHART_CONFIG,
  ELEVATOR_STATUS_CHART_DESCRIPTION,
  ELEVATOR_STATUS_CHART_TITLE,
} from './constants';
import { getAdditionalChartConfigFields, getElevatorStatusChartDataConfig } from './utils';

const ElevatorStatusMetrics = ({ className, dashboardMetrics, loading, error }: DashboardSectionProps) => {
  const chartData = useMemo(
    () => getElevatorStatusChartDataConfig(dashboardMetrics.elevatorRecordsMetrics),
    [dashboardMetrics.elevatorRecordsMetrics]
  );

  const additionalChartConfigFields = useMemo(
    () => getAdditionalChartConfigFields(dashboardMetrics.elevatorRecordsMetrics?.totalElevatorRecords),
    [dashboardMetrics.elevatorRecordsMetrics?.totalElevatorRecords]
  );

  return (
    <ChartMetrics
      additionalChartConfigFields={additionalChartConfigFields}
      cardDetails={{
        title: ELEVATOR_STATUS_CHART_TITLE,
        description: ELEVATOR_STATUS_CHART_DESCRIPTION,
      }}
      chartConfig={ELEVATOR_STATUS_CHART_CONFIG}
      chartData={chartData}
      chartType={ChartType.Pie}
      className={className}
      error={error}
      loading={loading}
      sectionTitle={SectionTitle.ElevatorStatusMetrics}
    />
  );
};

export default ElevatorStatusMetrics;
