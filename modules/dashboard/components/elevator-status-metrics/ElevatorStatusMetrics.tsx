import { getAdditionalChartConfigFields, getElevatorStatusChartDataConfig } from './utils';
import {
  ELEVATOR_STATUS_CHART_CONFIG,
  ELEVATOR_STATUS_CHART_DESCRIPTION,
  ELEVATOR_STATUS_CHART_TITLE,
} from './constants';
import { DashboardSectionProps, SectionTitle } from '../../types';
import { ElevatorRecordsMetrics } from '@/graphql/types/client/generated_types';
import { ChartType } from '@/shared/base-charts/types';
import ChartMetrics from '../chart-metrics';
import { useMemo } from 'react';

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
    <ChartMetrics<ElevatorRecordsMetrics>
      className={className}
      cardDetails={{
        title: ELEVATOR_STATUS_CHART_TITLE,
        description: ELEVATOR_STATUS_CHART_DESCRIPTION,
      }}
      chartData={chartData}
      additionalChartConfigFields={additionalChartConfigFields}
      chartConfig={ELEVATOR_STATUS_CHART_CONFIG}
      sectionTitle={SectionTitle.ElevatorStatusMetrics}
      loading={loading}
      error={error}
      chartType={ChartType.Pie}
    />
  );
};

export default ElevatorStatusMetrics;
