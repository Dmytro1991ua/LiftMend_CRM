import { useMemo, useState } from 'react';

import { Column } from '@tanstack/react-table';

import { GetRepairJobsQuery, QueryGetRepairJobsArgs } from '@/graphql/types/client/generated_types';
import { useFetchDropdownOptions } from '@/modules/repair-job-scheduling/hooks';
import BaseTable from '@/shared/base-table';
import useFilterInTable from '@/shared/base-table/hooks/useFilterInTable';
import useSearchInTable from '@/shared/base-table/hooks/useSearchInTable';
import TableActionBar from '@/shared/base-table/table-action-bar';
import QueryResponse from '@/shared/query-response';
import { StorageTableName } from '@/shared/types';

import useFetchRepairJobs from '../../hooks';

import { REPAIR_JOB_COLUMNS, RepairJob } from './columns';
import { getRepairJobFilterConfig } from './config';

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

  const { filters, onFilterChange, onClearFilter } = useFilterInTable<RepairJob>({
    tableStorageState,
    onSetTableStorageState,
  });

  const { dropdownOptions, error: repairJobDataError } = useFetchDropdownOptions();

  const [tableColumns, setTableColumns] = useState<Column<RepairJob, unknown>[]>([]);

  const filtersConfig = useMemo(() => getRepairJobFilterConfig(dropdownOptions), [dropdownOptions]);

  return (
    <>
      <QueryResponse errorDescription={repairJobDataError} errorMessage='Failed to fetch repair job data' />
      <TableActionBar<RepairJob>
        columns={tableColumns}
        filtersConfig={filtersConfig}
        searchTerm={searchTerm}
        storedFilters={filters}
        onClearFilter={onClearFilter}
        onClearSearch={onClearSearch}
        onFilterChange={onFilterChange}
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
