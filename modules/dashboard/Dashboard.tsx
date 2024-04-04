import { HiPlus } from 'react-icons/hi';

import { Button } from '@/components/ui/button';
import SectionHeader from '@/shared/section-header';
import { SectionHeaderTitle } from '@/types/enums';

const Dashboard = () => {
  //TODO: Example on how to use actionComponent for SectionHeader

  const sectionHeaderButton = (
    <Button>
      <HiPlus />
      <span className='ml-2'>Add Task</span>
    </Button>
  );

  return (
    <div className='flex flex-col'>
      <SectionHeader actionComponent={sectionHeaderButton} title={SectionHeaderTitle.Dashboard} />
      <div className='content-wrapper'>Dashboard content</div>
    </div>
  );
};

export default Dashboard;
