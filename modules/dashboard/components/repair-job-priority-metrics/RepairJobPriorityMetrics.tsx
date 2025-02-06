import { useMemo } from 'react';

import { ChartType } from '@/shared/base-charts/types';

import { DashboardSectionProps, SectionTitle } from '../../types';
import ChartMetrics from '../chart-metrics';

import {
  ADDITIONAL_CHART_CONFIG_FIELDS,
  REPAIR_JOB_PRIORITY_CHART_CONFIG,
  REPAIR_JOB_PRIORITY_CHART_DESCRIPTION,
  REPAIR_JOB_PRIORITY_CHART_TITLE,
} from './constants';
import { getRepairJobPriorityChartDataConfig } from './utils';

const RepairJobPriorityMetrics = ({ className, dashboardMetrics, loading, error }: DashboardSectionProps) => {
  const chartData = useMemo(
    () => getRepairJobPriorityChartDataConfig(dashboardMetrics.repairJobsMetrics),
    [dashboardMetrics.repairJobsMetrics]
  );

  return (
    <ChartMetrics
      additionalChartConfigFields={ADDITIONAL_CHART_CONFIG_FIELDS}
      cardDetails={{
        title: REPAIR_JOB_PRIORITY_CHART_TITLE,
        description: REPAIR_JOB_PRIORITY_CHART_DESCRIPTION,
      }}
      chartConfig={REPAIR_JOB_PRIORITY_CHART_CONFIG}
      chartData={chartData}
      chartType={ChartType.Bar}
      className={className}
      error={error}
      loading={loading}
      sectionTitle={SectionTitle.RepairJobSPriorityMetrics}
    />
  );
};

export default RepairJobPriorityMetrics;
