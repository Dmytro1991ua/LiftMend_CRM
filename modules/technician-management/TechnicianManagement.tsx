import SectionHeader from '@/shared/section-header';
import { SectionHeaderDescription, SectionHeaderTitle } from '@/types/enums';

import TechnicianManagementTable from './components/technician-management-table';

const TechnicianManagement = () => {
  return (
    <section>
      <SectionHeader
        subtitle={SectionHeaderDescription.TechnicianManagement}
        title={SectionHeaderTitle.TechnicianManagement}
      />
      <div className='content-wrapper'>
        <TechnicianManagementTable />
      </div>
    </section>
  );
};

export default TechnicianManagement;
