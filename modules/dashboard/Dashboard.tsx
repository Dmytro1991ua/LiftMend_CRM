import SectionHeader from '@/shared/section-header';
import { SectionHeaderTitle } from '@/types/enums';

import DashboardDateRangeFilter from './components/dashboard-date-range-filter';
import ElevatorStatusMetrics from './components/elevator-status-metrics';
import ElevatorTypeMetrics from './components/elevator-type-metrics';
import KeyAppMetrics from './components/key-app-metrics';
import RepairJobPriorityMetrics from './components/repair-job-priority-metrics';
import RepairJobStatusMetrics from './components/repair-job-status-metrics';
import RepairJobTypeMetrics from './components/repair-job-type-metrics';
import TechnicianVisibilityMetrics from './components/technician-visibility-metrics';
import { useDashBoard } from './hooks';

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

  return (
    <section className='flex flex-col h-[80vh]'>
      <SectionHeader
        actionComponent={
          <DashboardDateRangeFilter
            isCalendarOpen={isCalendarOpen}
            sanitizedDateRange={sanitizedDateRange}
            onHandleCalendarPopoverClose={onHandleCalendarPopoverClose}
          />
        }
        subtitle={welcomeMessage}
        title={SectionHeaderTitle.Dashboard}
      />
      <section className='content-wrapper flex-grow overflow-y-auto'>
        <KeyAppMetrics dashboardMetrics={dashboardMetrics} error={error} loading={loading} />
        <div className='grid grid-cols-1 gap-2 xl:grid-cols-2'>
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
      </section>
    </section>
  );
};

export default Dashboard;
