import DatePicker from '@/shared/date-picker';
import SectionHeader from '@/shared/section-header';
import { SectionHeaderTitle } from '@/types/enums';

const Dashboard = () => {
  return (
    <div className='flex flex-col'>
      <SectionHeader actionComponent={<DatePicker />} title={SectionHeaderTitle.Dashboard} />
      <div className='content-wrapper'>Dashboard content</div>
    </div>
  );
};

export default Dashboard;
