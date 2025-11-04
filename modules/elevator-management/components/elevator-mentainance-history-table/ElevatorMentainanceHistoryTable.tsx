import React, { useCallback } from 'react';

import { ApolloQueryResult } from '@apollo/client';
import { Row } from '@tanstack/react-table';
import { useRouter } from 'next/router';

import {
  Exact,
  GetElevatorMentainanceHistoryQuery,
  GetElevatorMentainanceHistoryQueryVariables,
  InputMaybe,
  PaginationOptions,
} from '@/graphql/types/client/generated_types';
import BaseTable from '@/shared/base-table';
import { onHandleRowClick } from '@/shared/base-table/utils';
import QueryResponse from '@/shared/query-response';
import { ElevatorRecord, RepairJob, TableNames } from '@/shared/types';
import { NOOP } from '@/shared/utils';
import { AppRoutes } from '@/types/enums';

import { ElEVATOR_MENTAINANCE_HISTORY_COLUMNS } from './columns';
import { useElevatorMentainanceHistory } from './hooks';

type ElevatorMentainanceHistoryTableProps = {
  elevatorRecord: Pick<ElevatorRecord, 'buildingName' | 'elevatorLocation'>;
};

const ElevatorMentainanceHistoryTable = ({ elevatorRecord }: ElevatorMentainanceHistoryTableProps) => {
  const router = useRouter();

  const { buildingName, elevatorLocation } = elevatorRecord;

  const { elevatorMentainanceHistory, loading, hasMore, error, onNext } = useElevatorMentainanceHistory(
    buildingName,
    elevatorLocation
  );

  const onRowClick = useCallback(
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
      <QueryResponse
        errorDescription={error}
        errorMessage='Failed to fetch elevator mentainance history data'
        isErrorOccurred={!!error}
      />
      <BaseTable<RepairJob, GetElevatorMentainanceHistoryQuery, GetElevatorMentainanceHistoryQueryVariables>
        className='h-[28rem]'
        columns={ElEVATOR_MENTAINANCE_HISTORY_COLUMNS}
        data={elevatorMentainanceHistory}
        emptyTableMessage={'No elevator maintenance history found.'}
        errorMessage={error}
        filtersConfig={[]}
        hasMore={hasMore}
        hasTableFilters={false}
        isCalculatedWidthEnabled={false}
        isRowDisabled={() => false}
        loadMore={onNext}
        loading={loading}
        refetch={async () => {
          return {} as ApolloQueryResult<
            Exact<{
              buildingName: string;
              elevatorLocation: string;
              paginationOptions?: InputMaybe<PaginationOptions>;
            }>
          >;
        }}
        tableName={TableNames.ElevatorMentainanceHistory}
        tableStorageState={{}}
        onHandleRowClick={onRowClick}
        onSetTableStorageState={NOOP}
      />
    </>
  );
};

export default ElevatorMentainanceHistoryTable;
