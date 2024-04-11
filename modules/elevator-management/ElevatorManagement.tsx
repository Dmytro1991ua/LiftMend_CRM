import { HiPlus } from 'react-icons/hi';

import ElevatorManagementTable from './elevator-management-table';

import { Button } from '@/components/ui/button';
import SectionHeader from '@/shared/section-header';
import { SectionHeaderTitle } from '@/types/enums';

const ElevatorManagement = (): React.JSX.Element => {
  //TODO: Example on how to use actionComponent for SectionHeader
  const sectionHeaderButton = (
    <Button>
      <HiPlus />
      <span className='ml-2'>Add Task</span>
    </Button>
  );

  return (
    <div className='flex flex-col'>
      <SectionHeader actionComponent={sectionHeaderButton} title={SectionHeaderTitle.ElevatorManagement} />
      <div className='content-wrapper'>
        <ElevatorManagementTable />
      </div>
    </div>
  );
};

export default ElevatorManagement;
