import { GetRepairJobsQuery, QueryGetRepairJobsArgs } from '@/graphql/types/client/generated_types';
import BaseTable from '@/shared/base-table';
import useRowSelectionInTable from '@/shared/hooks/useRowSelectionInTable';
import useSearchInTable from '@/shared/hooks/useSearchInTable';
import useSortingInTable from '@/shared/hooks/useSortingInTable';

import useFetchRepairJobs from '../../hooks';
import TableActionBar from '../table-action-bar';

import { REPAIR_JOB_COLUMNS, RepairJob } from './columns';

const RepairJobTable = () => {
  const { repairJobs, hasMore, loading, error, tableStorageState, onSetTableStorageState, refetch, onNext } =
    useFetchRepairJobs<RepairJob>();

  const { searchTerm, onClearSearch, onSearch } = useSearchInTable<
    RepairJob,
    QueryGetRepairJobsArgs,
    GetRepairJobsQuery
  >({
    tableStorageState,
    onSetTableStorageState,
    refetch,
  });

  const { sorting, onSetSorting } = useSortingInTable<RepairJob>({ tableStorageState, onSetTableStorageState });

  const { rowSelection, onRowSelectionChange } = useRowSelectionInTable<RepairJob>({
    tableStorageState,
    onSetTableStorageState,
    tableData: repairJobs,
  });

  return (
    <>
      <TableActionBar searchTerm={searchTerm} onClearSearch={onClearSearch} onSearch={onSearch} />
      <BaseTable
        className='h-[48rem]'
        columns={REPAIR_JOB_COLUMNS}
        data={repairJobs}
        errorMessage={error}
        hasMore={hasMore}
        loadMore={onNext}
        loading={loading}
        rowSelection={rowSelection}
        sorting={sorting}
        onRowSelectionChange={onRowSelectionChange}
        onSetSorting={onSetSorting}
      />
    </>
  );
};

export default RepairJobTable;
