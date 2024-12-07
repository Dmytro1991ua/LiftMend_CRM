import SectionHeader from '@/shared/section-header';
import { SectionHeaderDescription, SectionHeaderTitle } from '@/types/enums';

import ElevatorManagementTable from './components/elevator-management-table';

const ElevatorManagement = (): React.JSX.Element => {
  return (
    <div className='flex flex-col'>
      <SectionHeader
        subtitle={SectionHeaderDescription.ElevatorManagement}
        title={SectionHeaderTitle.ElevatorManagement}
      />
      <div className='content-wrapper'>
        <ElevatorManagementTable />
      </div>
    </div>
  );
};

export default ElevatorManagement;
