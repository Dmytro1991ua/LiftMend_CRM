import { useState } from 'react';

import { Column } from '@tanstack/react-table';

import { GetRepairJobsQuery, QueryGetRepairJobsArgs } from '@/graphql/types/client/generated_types';
import BaseTable from '@/shared/base-table';
import useSearchInTable from '@/shared/base-table/hooks/useSearchInTable';
import TableActionBar from '@/shared/base-table/table-action-bar';

import useFetchRepairJobs from '../../hooks';

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

  const [tableColumns, setTableColumns] = useState<Column<RepairJob, unknown>[]>([]);

  return (
    <>
      <TableActionBar<RepairJob>
        columns={tableColumns}
        searchTerm={searchTerm}
        onClearSearch={onClearSearch}
        onSearch={onSearch}
      />
      <BaseTable<RepairJob>
        className='h-[48rem]'
        columns={REPAIR_JOB_COLUMNS}
        data={repairJobs}
        errorMessage={error}
        hasMore={hasMore}
        loadMore={onNext}
        loading={loading}
        tableStorageState={tableStorageState}
        onSetTableColumns={setTableColumns}
        onSetTableStorageState={onSetTableStorageState}
      />
    </>
  );
};

export default RepairJobTable;
