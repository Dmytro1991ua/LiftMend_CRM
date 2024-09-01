import SectionHeader from '@/shared/section-header';
import { SectionHeaderDescription, SectionHeaderTitle } from '@/types/enums';

import RepairJobTable from './components/repair-job-table/RepairJobTable';

const RepairJobTracking = () => {
  return (
    <section>
      <SectionHeader
        subtitle={SectionHeaderDescription.RepairJobTracking}
        title={SectionHeaderTitle.RepairJobTracking}
      />
      <div className='content-wrapper'>
        <RepairJobTable />
      </div>
    </section>
  );
};

export default RepairJobTracking;
