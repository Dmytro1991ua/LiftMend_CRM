import {
  Exact,
  GetRecentRepairJobsQuery,
  GetRecentRepairJobsQueryVariables,
} from '@/graphql/types/client/generated_types';
import BaseTable from '@/shared/base-table';
import QueryResponse from '@/shared/query-response';
import { RECENT_REPAIR_JOB_COLUMNS } from './columns';
import { useFetchRecentRepairJobs } from '../../hooks';
import { RepairJob, TableNames } from '@/shared/types';
import { ApolloQueryResult } from '@apollo/client';

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
        hasMore={false}
        isRowDisabled={() => false}
        loadMore={() => {}}
        loading={loading}
        tableName={TableNames.RecentRepairJobs}
        tableStorageState={{}}
        filtersConfig={[]}
        refetch={async (_variables: Partial<GetRecentRepairJobsQuery>) => {
          return {} as ApolloQueryResult<Exact<{ jobsCount?: number }>>;
        }}
        onSetTableStorageState={() => {}}
        onHandleRowClick={() => {}}
        hasTableFilters={false}
        tableHeaderContent={<h3 className='text-xl font-bold mb-2 text-center'>Recent Repair Jobs</h3>}
      />
    </>
  );
};

export default RecentRepairJobsTable;
