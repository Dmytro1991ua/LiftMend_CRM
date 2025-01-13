import { useMemo } from 'react';

import { Bars } from 'react-loader-spinner';

import { cn } from '@/lib/utils';
import BaseCard from '@/shared/base-card';
import BaseChart from '@/shared/base-charts';
import { ChartType } from '@/shared/base-charts/types';
import QueryResponse from '@/shared/query-response';

import { useFetchDashboardMetrics } from '../../hooks';
import { SectionTitle } from '../../types';
import SectionWrapper from '../section-wrapper';

import {
  DEFAULT_ERROR_RESPONSE_MESSAGE,
  TECHNICIAN_ASSIGNMENT_CHART_CONFIG,
  TECHNICIAN_AVAILABILITY_CHART_DESCRIPTION,
  TECHNICIAN_AVAILABILITY_CHART_TITLE,
} from './constants';
import { getAdditionalChartConfigFields, getTechnicianAssignmentChartDataConfig } from './utils';

type TechnicianVisibilityMetricsProps = {
  className?: string;
};
const TechnicianVisibilityMetrics = ({ className }: TechnicianVisibilityMetricsProps) => {
  const { dashboardMetrics, loading, error } = useFetchDashboardMetrics();

  const chartData = useMemo(
    () => getTechnicianAssignmentChartDataConfig(dashboardMetrics.technicianRecordsMetrics),
    [dashboardMetrics.technicianRecordsMetrics]
  );

  const additionalChartConfigFields = useMemo(
    () => getAdditionalChartConfigFields(dashboardMetrics.technicianRecordsMetrics?.totalTechnicianRecords),
    [dashboardMetrics.technicianRecordsMetrics?.totalTechnicianRecords]
  );

  const renderChart = (
    <>
      {loading ? (
        <Bars
          ariaLabel='bars-loading'
          color='#2563eb'
          height='80'
          visible={true}
          width='80'
          wrapperClass='justify-center'
        />
      ) : (
        <BaseChart
          additionalChartConfigFields={additionalChartConfigFields}
          chartType={ChartType.Pie}
          className='w-full h-auto'
          config={TECHNICIAN_ASSIGNMENT_CHART_CONFIG}
          data={chartData}
        />
      )}
    </>
  );

  return (
    <>
      <QueryResponse errorDescription={error} errorMessage={DEFAULT_ERROR_RESPONSE_MESSAGE} isErrorOccurred={!!error} />
      <section className={className}>
        <SectionWrapper title={SectionTitle.TechnicianAvailabilityMetrics}>
          <BaseCard
            cardClassName={cn('bg-blue-100')}
            cardDescriptionClassName='text-white'
            cardHeaderClassName='bg-primary text-white text-lg items-center'
            description={TECHNICIAN_AVAILABILITY_CHART_DESCRIPTION}
            title={TECHNICIAN_AVAILABILITY_CHART_TITLE}
          >
            {renderChart}
          </BaseCard>
        </SectionWrapper>
      </section>
    </>
  );
};

export default TechnicianVisibilityMetrics;
