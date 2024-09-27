import { useMemo, useState } from 'react';

import { Column, Row } from '@tanstack/react-table';
import { useRouter } from 'next/router';

import { GetRepairJobsQuery, QueryGetRepairJobsArgs } from '@/graphql/types/client/generated_types';
import { useFetchDropdownOptions } from '@/modules/repair-job-scheduling/hooks';
import BaseTable from '@/shared/base-table';
import useFilterInTable from '@/shared/base-table/hooks/useFilterInTable';
import useSearchInTable from '@/shared/base-table/hooks/useSearchInTable';
import TableActionBar from '@/shared/base-table/table-action-bar';
import QueryResponse from '@/shared/query-response';
import { AppRoutes } from '@/types/enums';

import useFetchRepairJobs from '../../hooks';

import { REPAIR_JOB_COLUMNS, RepairJob } from './columns';
import { getRepairJobFilterConfig } from './config';
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

  const { filters, onFilterChange, onClearFilter } = useFilterInTable<RepairJob>({
    tableStorageState,
    onSetTableStorageState,
  });

  const { dropdownOptions, error: repairJobDataError } = useFetchDropdownOptions();

  const [tableColumns, setTableColumns] = useState<Column<RepairJob, unknown>[]>([]);

  const filtersConfig = useMemo(() => getRepairJobFilterConfig(dropdownOptions), [dropdownOptions]);
  const emptyTableMessage = useMemo(
    () => getEmptyTableMessage(searchTerm, !!repairJobs.length),
    [searchTerm, repairJobs.length]
  );

  const onHandleRowClick = (rowData: Row<RepairJob>) => {
    const {
      original: { id: repairJobId },
    } = rowData;

    // Check if any text is selected by the user (e.g., for copying)
    const selectedText = window.getSelection()?.toString();

    // If no text is selected, proceed to navigate to the repair job detail page
    if (!selectedText) {
      router.push(`${AppRoutes.RepairJobTracking}/${repairJobId}`);
    }
  };

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
        emptyTableMessage={emptyTableMessage}
        errorMessage={error}
        hasMore={hasMore}
        loadMore={onNext}
        loading={loading}
        tableStorageState={tableStorageState}
        onHandleRowClick={onHandleRowClick}
        onSetTableColumns={setTableColumns}
        onSetTableStorageState={onSetTableStorageState}
      />
    </>
  );
};

export default RepairJobTable;
