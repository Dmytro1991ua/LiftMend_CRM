import { useMemo } from 'react';

import BaseAppMetrics from '@/shared/base-app-metrics';
import BaseDateRangeFilter from '@/shared/base-date-range-filter/BaseDateRangeFilter';
import SectionHeader from '@/shared/section-header';
import { SectionHeaderTitle } from '@/types/enums';

import ElevatorStatusMetrics from './components/elevator-status-metrics';
import ElevatorTypeMetrics from './components/elevator-type-metrics';
import { RecentRepairJobsTable } from './components/recent-repair-jobs-table';
import RepairJobPriorityMetrics from './components/repair-job-priority-metrics';
import RepairJobStatusMetrics from './components/repair-job-status-metrics';
import RepairJobTypeMetrics from './components/repair-job-type-metrics';
import TechnicianVisibilityMetrics from './components/technician-visibility-metrics';
import { DEFAULT_DASHBOARD_DATE_RANGE_INFO_TOOLTIP_MESSAGE } from './constants';
import { useDashBoard } from './hooks';
import { SectionTitle } from './types';
import { getKeyMetricsConfig } from './utils';

const Dashboard = () => {
  const {
    dashboardMetrics,
    isCalendarOpen,
    error,
    welcomeMessage,
    loading,
    sanitizedDateRange,
    onHandleCalendarPopoverClose,
  } = useDashBoard();

  const dashboardMetricsConfig = useMemo(() => getKeyMetricsConfig(dashboardMetrics), [dashboardMetrics]);

  return (
    <section className='flex flex-col h-[80vh]'>
      <SectionHeader
        actionComponent={
          <BaseDateRangeFilter
            isCalendarOpen={isCalendarOpen}
            sanitizedDateRange={sanitizedDateRange}
            tooltipMessage={DEFAULT_DASHBOARD_DATE_RANGE_INFO_TOOLTIP_MESSAGE}
            onHandleCalendarPopoverClose={onHandleCalendarPopoverClose}
          />
        }
        subtitle={welcomeMessage}
        title={SectionHeaderTitle.Dashboard}
      />
      <section className='content-wrapper flex-grow overflow-y-auto'>
        <BaseAppMetrics
          error={error}
          loading={loading}
          metricsConfig={dashboardMetricsConfig}
          sectionTitle={SectionTitle.KeyAppMetrics}
        />
        <div className='grid grid-cols-1 mb-2 gap-2 xl:grid-cols-2'>
          <TechnicianVisibilityMetrics dashboardMetrics={dashboardMetrics} error={error} loading={loading} />
          <ElevatorStatusMetrics dashboardMetrics={dashboardMetrics} error={error} loading={loading} />
          <RepairJobStatusMetrics dashboardMetrics={dashboardMetrics} error={error} loading={loading} />
          <RepairJobPriorityMetrics dashboardMetrics={dashboardMetrics} error={error} loading={loading} />
          <RepairJobTypeMetrics dashboardMetrics={dashboardMetrics} error={error} loading={loading} />
          <ElevatorTypeMetrics
            className='[&_.recharts-pie-label-text]:fill-foreground [&_.recharts-pie-label-line]:stroke-foreground'
            dashboardMetrics={dashboardMetrics}
            error={error}
            loading={loading}
          />
        </div>
        <RecentRepairJobsTable />
      </section>
    </section>
  );
};

export default Dashboard;
