import { useMemo } from 'react';

import { TechnicianRecordsMetrics } from '@/graphql/types/client/generated_types';
import { ChartType } from '@/shared/base-charts/types';

import { DashboardSectionProps, SectionTitle } from '../../types';
import ChartMetrics from '../chart-metrics';

import {
  TECHNICIAN_ASSIGNMENT_CHART_CONFIG,
  TECHNICIAN_AVAILABILITY_CHART_DESCRIPTION,
  TECHNICIAN_AVAILABILITY_CHART_TITLE,
} from './constants';
import { getAdditionalChartConfigFields, getTechnicianAssignmentChartDataConfig } from './utils';

const TechnicianVisibilityMetrics = ({ className, error, loading, dashboardMetrics }: DashboardSectionProps) => {
  const chartData = useMemo(
    () => getTechnicianAssignmentChartDataConfig(dashboardMetrics.technicianRecordsMetrics),
    [dashboardMetrics.technicianRecordsMetrics]
  );

  const additionalChartConfigFields = useMemo(
    () => getAdditionalChartConfigFields(dashboardMetrics.technicianRecordsMetrics?.totalTechnicianRecords),
    [dashboardMetrics.technicianRecordsMetrics?.totalTechnicianRecords]
  );

  return (
    <ChartMetrics<TechnicianRecordsMetrics>
      additionalChartConfigFields={additionalChartConfigFields}
      cardDetails={{
        title: TECHNICIAN_AVAILABILITY_CHART_TITLE,
        description: TECHNICIAN_AVAILABILITY_CHART_DESCRIPTION,
      }}
      chartConfig={TECHNICIAN_ASSIGNMENT_CHART_CONFIG}
      chartData={chartData}
      chartType={ChartType.Pie}
      className={className}
      error={error}
      loading={loading}
      sectionTitle={SectionTitle.TechnicianAvailabilityMetrics}
    />
  );
};

export default TechnicianVisibilityMetrics;
