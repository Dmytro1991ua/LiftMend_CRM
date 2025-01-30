import DatePicker from '@/shared/date-picker';
import SectionHeader from '@/shared/section-header';
import { SectionHeaderTitle } from '@/types/enums';

import ElevatorStatusMetrics from './components/elevator-status-metrics';
import KeyAppMetrics from './components/key-app-metrics';
import RepairJobStatusMetrics from './components/repair-job-status-metrics';
import TechnicianVisibilityMetrics from './components/technician-visibility-metrics';
import { useFetchDashboardMetrics } from './hooks';
import RepairJobPriorityMetrics from './components/repair-job-priority-metrics';
import RepairJobTypeMetrics from './components/repair-job-type-metrics';

const Dashboard = () => {
  const { dashboardMetrics, loading, error } = useFetchDashboardMetrics();

  return (
    <section className='flex flex-col h-[80vh]'>
      <SectionHeader actionComponent={<DatePicker />} title={SectionHeaderTitle.Dashboard} />
      <section className='content-wrapper flex-grow overflow-y-auto'>
        <KeyAppMetrics />
        <div className='grid grid-cols-1 gap-2 xl:grid-cols-2'>
          <TechnicianVisibilityMetrics dashboardMetrics={dashboardMetrics} error={error} loading={loading} />
          <ElevatorStatusMetrics dashboardMetrics={dashboardMetrics} error={error} loading={loading} />
          <RepairJobStatusMetrics dashboardMetrics={dashboardMetrics} error={error} loading={loading} />
          <TechnicianVisibilityMetrics dashboardMetrics={dashboardMetrics} loading={loading} error={error} />
          <ElevatorStatusMetrics dashboardMetrics={dashboardMetrics} loading={loading} error={error} />
          <RepairJobStatusMetrics dashboardMetrics={dashboardMetrics} loading={loading} error={error} />
          <RepairJobPriorityMetrics dashboardMetrics={dashboardMetrics} loading={loading} error={error} />
          <RepairJobTypeMetrics dashboardMetrics={dashboardMetrics} loading={loading} error={error} />
        </div>
      </section>
    </section>
  );
};

export default Dashboard;
