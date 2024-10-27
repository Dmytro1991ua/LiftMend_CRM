import { useCallback, useMemo } from 'react';

import { Row } from '@tanstack/react-table';
import { useRouter } from 'next/router';

import {
  GetRepairJobFromDataQuery,
  GetRepairJobsQuery,
  QueryGetRepairJobsArgs,
} from '@/graphql/types/client/generated_types';
import BaseTable from '@/shared/base-table';
import useSearchInTable from '@/shared/base-table/hooks/useSearchInTable';
import { getEmptyTableMessage, onHandleRowClick } from '@/shared/base-table/utils';
import { useFetchDropdownOptions } from '@/shared/hooks/useFetchDropdownOptions';
import { DropdownOptions } from '@/shared/hooks/useFetchDropdownOptions/config';
import QueryResponse from '@/shared/query-response';
import { RepairJob, TableNames } from '@/shared/types';
import { AppRoutes } from '@/types/enums';

import useFetchRepairJobs from '../../hooks';

import { REPAIR_JOB_COLUMNS } from './columns';
import { getRepairJobFilterConfig } from './config';
import {
  DEFAULT_REPAIR_JOBS_TABLE_EMPTY_TABLE_MESSAGE,
  DEFAULT_REPAIR_JOB_TABLE_ROW_TOOLTIP_MESSAGE,
  DEFAULT_SEARCH_INPUT_PLACEHOLDER,
} from './constants';

const RepairJobTable = () => {
  const router = useRouter();

  const { repairJobs, hasMore, loading, error, tableStorageState, onSetTableStorageState, refetch, onNext } =
    useFetchRepairJobs<RepairJob>();

  const { searchTerm } = useSearchInTable<RepairJob, QueryGetRepairJobsArgs, GetRepairJobsQuery>({
    tableStorageState,
    onSetTableStorageState,
    refetch,
  });

  const { dropdownOptions, error: repairJobDataError } = useFetchDropdownOptions<GetRepairJobFromDataQuery>(
    DropdownOptions.RepairJob
  );

  const filtersConfig = useMemo(() => getRepairJobFilterConfig(dropdownOptions), [dropdownOptions]);

  const emptyTableMessage = useMemo(
    () => getEmptyTableMessage(searchTerm, !!repairJobs.length, DEFAULT_REPAIR_JOBS_TABLE_EMPTY_TABLE_MESSAGE),
    [searchTerm, repairJobs.length]
  );

  const onRepairJobRowClick = useCallback(
    (rowData: Row<RepairJob>) => {
      const {
        original: { id },
      } = rowData;

      onHandleRowClick({ id, route: AppRoutes.RepairJobTracking, router });
    },
    [router]
  );

  return (
    <>
      <QueryResponse errorDescription={repairJobDataError} errorMessage='Failed to fetch repair job data' />
      <BaseTable<RepairJob, QueryGetRepairJobsArgs, GetRepairJobsQuery>
        className='h-[48rem]'
        columns={REPAIR_JOB_COLUMNS}
        data={repairJobs}
        emptyTableMessage={emptyTableMessage}
        errorMessage={error}
        filtersConfig={filtersConfig}
        hasMore={hasMore}
        loadMore={onNext}
        loading={loading}
        refetch={refetch}
        rowTooltipMessage={DEFAULT_REPAIR_JOB_TABLE_ROW_TOOLTIP_MESSAGE}
        searchFieldPlaceholder={DEFAULT_SEARCH_INPUT_PLACEHOLDER}
        tableName={TableNames.RepairJobsTable}
        tableStorageState={tableStorageState}
        onHandleRowClick={onRepairJobRowClick}
        onSetTableStorageState={onSetTableStorageState}
      />
    </>
  );
};

export default RepairJobTable;
