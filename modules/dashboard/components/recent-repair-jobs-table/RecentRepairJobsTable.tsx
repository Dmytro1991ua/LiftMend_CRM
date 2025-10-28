import { ApolloQueryResult } from '@apollo/client';

import {
  Exact,
  GetRecentRepairJobsQuery,
  GetRecentRepairJobsQueryVariables,
} from '@/graphql/types/client/generated_types';
import BaseTable from '@/shared/base-table';
import QueryResponse from '@/shared/query-response';
import { RepairJob, TableNames } from '@/shared/types';

import { useFetchRecentRepairJobs } from '../../hooks';

import { RECENT_REPAIR_JOB_COLUMNS } from './columns';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const NOOP = (): void => {};

const RecentRepairJobsTable = () => {
  const { recentRepairJobs, loading, error } = useFetchRecentRepairJobs();

  return (
    <>
      <QueryResponse
        errorDescription={error}
        errorMessage='Failed to fetch recent repair job data'
        isErrorOccurred={!!error}
      />
      <BaseTable<RepairJob, GetRecentRepairJobsQuery, GetRecentRepairJobsQueryVariables>
        className='h-[38rem]'
        columns={RECENT_REPAIR_JOB_COLUMNS}
        data={recentRepairJobs}
        emptyTableMessage={'No recent repair jobs found.'}
        errorMessage={error}
        filtersConfig={[]}
        hasMore={false}
        hasTableFilters={false}
        isFullWidthTable={false}
        isRowDisabled={() => false}
        loadMore={NOOP}
        loading={loading}
        refetch={async () => {
          return {} as ApolloQueryResult<Exact<{ jobsCount?: number }>>;
        }}
        tableHeaderContent={<h3 className='text-xl font-bold mb-2 text-center'>Recent Repair Jobs</h3>}
        tableName={TableNames.RecentRepairJobs}
        tableStorageState={{}}
        onHandleRowClick={NOOP}
        onSetTableStorageState={NOOP}
      />
    </>
  );
};

export default RecentRepairJobsTable;
