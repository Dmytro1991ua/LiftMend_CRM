import { DashboardSectionProps, SectionTitle } from '../../types';

import { getAdditionalChartConfigFields, getTechnicianAssignmentChartDataConfig } from './utils';
import {
  TECHNICIAN_ASSIGNMENT_CHART_CONFIG,
  TECHNICIAN_AVAILABILITY_CHART_DESCRIPTION,
  TECHNICIAN_AVAILABILITY_CHART_TITLE,
} from './constants';
import ChartMetrics from '../chart-metrics';
import { TechnicianRecordsMetrics } from '@/graphql/types/client/generated_types';
import { ChartType } from '@/shared/base-charts/types';
import { useMemo } from 'react';

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
      className={className}
      cardDetails={{
        title: TECHNICIAN_AVAILABILITY_CHART_TITLE,
        description: TECHNICIAN_AVAILABILITY_CHART_DESCRIPTION,
      }}
      chartData={chartData}
      additionalChartConfigFields={additionalChartConfigFields}
      chartConfig={TECHNICIAN_ASSIGNMENT_CHART_CONFIG}
      sectionTitle={SectionTitle.TechnicianAvailabilityMetrics}
      loading={loading}
      error={error}
      chartType={ChartType.Pie}
    />
  );
};

export default TechnicianVisibilityMetrics;
