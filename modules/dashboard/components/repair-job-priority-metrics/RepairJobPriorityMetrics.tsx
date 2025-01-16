import { useMemo } from 'react';
import { DashboardSectionProps, SectionTitle } from '../../types';
import { getRepairJobPriorityChartDataConfig } from './utils';
import ChartMetrics from '../chart-metrics';
import { RepairJobsMetrics } from '@/graphql/types/client/generated_types';
import {
  ADDITIONAL_CHART_CONFIG_FIELDS,
  REPAIR_JOB_PRIORITY_CHART_CONFIG,
  REPAIR_JOB_PRIORITY_CHART_DESCRIPTION,
  REPAIR_JOB_PRIORITY_CHART_TITLE,
} from './constants';
import { ChartType } from '@/shared/base-charts/types';

const RepairJobPriorityMetrics = ({ className, dashboardMetrics, loading, error }: DashboardSectionProps) => {
  const chartData = useMemo(
    () => getRepairJobPriorityChartDataConfig(dashboardMetrics.repairJobsMetrics),
    [dashboardMetrics.elevatorRecordsMetrics]
  );

  return (
    <ChartMetrics<RepairJobsMetrics>
      className={className}
      cardDetails={{
        title: REPAIR_JOB_PRIORITY_CHART_TITLE,
        description: REPAIR_JOB_PRIORITY_CHART_DESCRIPTION,
      }}
      chartData={chartData}
      additionalChartConfigFields={ADDITIONAL_CHART_CONFIG_FIELDS}
      chartConfig={REPAIR_JOB_PRIORITY_CHART_CONFIG}
      sectionTitle={SectionTitle.RepairJobSPriorityMetrics}
      loading={loading}
      error={error}
      chartType={ChartType.Bar}
    />
  );
};

export default RepairJobPriorityMetrics;
