import BaseTable from '@/shared/base-table';
import useSearchInTable from '@/shared/hooks/useSearchInTable';
import useSortingInTable from '@/shared/hooks/useSortingInTable';

import useFetchRepairJobs from '../../hooks/useFetchRepairJobs';
import TableActionBar from '../table-action-bar';

import { REPAIR_JOB_COLUMNS } from './columns';

const RepairJobTable = () => {
  const { repairJobs, hasMore, loading, error, tableStorageState, onSetTableStorageState, refetch, onNext } =
    useFetchRepairJobs();

  const { onClearSearch, onSearch } = useSearchInTable({ tableStorageState, onSetTableStorageState, refetch });

  const { onSetSorting } = useSortingInTable({ onSetTableStorageState });

  return (
    <>
      <TableActionBar
        searchTerm={tableStorageState.filters?.searchTerm ?? ''}
        onClearSearch={onClearSearch}
        onSearch={onSearch}
      />
      <BaseTable
        className='h-[48rem]'
        columns={REPAIR_JOB_COLUMNS}
        data={repairJobs}
        errorMessage={error}
        hasMore={hasMore}
        loadMore={onNext}
        loading={loading}
        sorting={tableStorageState?.sorting ?? []}
        onSetSorting={onSetSorting}
      />
    </>
  );
};

export default RepairJobTable;
