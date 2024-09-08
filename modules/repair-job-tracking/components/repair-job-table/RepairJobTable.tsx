import BaseTable from '@/shared/base-table';

import useFetchRepairJobs from '../../hooks/useFetchRepairJobs';

import { REPAIR_JOB_COLUMNS } from './columns';

const RepairJobTable = () => {
  const { repairJobs, hasMore, sorting, loading, error, onNext, onSetSorting } = useFetchRepairJobs();

  return (
    <BaseTable
      columns={REPAIR_JOB_COLUMNS}
      data={repairJobs}
      errorMessage={error}
      hasMore={hasMore}
      loadMore={onNext}
      loading={loading}
      sorting={sorting}
      onSetSorting={onSetSorting}
    />
  );
};

export default RepairJobTable;
