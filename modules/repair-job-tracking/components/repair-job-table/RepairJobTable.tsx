import { useMemo, useState } from 'react';

import { Column, Row } from '@tanstack/react-table';
import { useRouter } from 'next/router';

import { GetRepairJobsQuery, QueryGetRepairJobsArgs } from '@/graphql/types/client/generated_types';
import BaseTable from '@/shared/base-table';
import useSearchInTable from '@/shared/base-table/hooks/useSearchInTable';
import TableActionBar from '@/shared/base-table/table-action-bar';
import { AppRoutes } from '@/types/enums';

import useFetchRepairJobs from '../../hooks';

import { REPAIR_JOB_COLUMNS, RepairJob } from './columns';
import { getEmptyTableMessage } from './utils';

const RepairJobTable = () => {
  const router = useRouter();

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

  const emptyTableMessage = useMemo(
    () => getEmptyTableMessage(searchTerm, !!repairJobs.length),
    [searchTerm, repairJobs.length]
  );

  const onHandleEventClick = (rowData: Row<RepairJob>) => {
    const {
      original: { id: repairJobId },
    } = rowData;

    router.push(`${AppRoutes.RepairJobTracking}/${repairJobId}`);
  };

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
        emptyTableMessage={emptyTableMessage}
        errorMessage={error}
        hasMore={hasMore}
        loadMore={onNext}
        loading={loading}
        tableStorageState={tableStorageState}
        onHandleEventClick={onHandleEventClick}
        onSetTableColumns={setTableColumns}
        onSetTableStorageState={onSetTableStorageState}
      />
    </>
  );
};

export default RepairJobTable;
