import DatePicker from '@/shared/date-picker';
import SectionHeader from '@/shared/section-header';
import { SectionHeaderTitle } from '@/types/enums';

import KeyAppMetrics from './components/key-app-metrics';
import TechnicianVisibilityMetrics from './components/technician-visibility-metrics';
import ElevatorStatusMetrics from './components/elevator-status-metrics';
import { useFetchDashboardMetrics } from './hooks';

const Dashboard = () => {
  const { dashboardMetrics, loading, error } = useFetchDashboardMetrics();

  return (
    <section className='flex flex-col h-[80vh]'>
      <SectionHeader actionComponent={<DatePicker />} title={SectionHeaderTitle.Dashboard} />
      <section className='content-wrapper flex-grow overflow-y-auto'>
        <KeyAppMetrics />
        <div className='grid grid-cols-1 gap-2 xl:grid-cols-2'>
          <TechnicianVisibilityMetrics dashboardMetrics={dashboardMetrics} loading={loading} error={error} />
          <ElevatorStatusMetrics dashboardMetrics={dashboardMetrics} loading={loading} error={error} />
        </div>
      </section>
    </section>
  );
};

export default Dashboard;
