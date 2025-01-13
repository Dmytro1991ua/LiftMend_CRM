import DatePicker from '@/shared/date-picker';
import SectionHeader from '@/shared/section-header';
import { SectionHeaderTitle } from '@/types/enums';

import KeyAppMetrics from './components/key-app-metrics';
import TechnicianVisibilityMetrics from './components/technician-visibility-metrics';

const Dashboard = () => {
  return (
    <section className='flex flex-col h-[80vh]'>
      <SectionHeader actionComponent={<DatePicker />} title={SectionHeaderTitle.Dashboard} />
      <section className='content-wrapper flex-grow overflow-y-auto'>
        <KeyAppMetrics />
        <div className='grid grid-cols-1 gap-2 xl:grid-cols-2'>
          <TechnicianVisibilityMetrics />
        </div>
      </section>
    </section>
  );
};

export default Dashboard;
