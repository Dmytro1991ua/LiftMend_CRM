import { useMemo } from 'react';

import { useQuery } from '@apollo/client';

import { GET_ELEVATOR_MAINTENANCE_HISTORY } from '@/graphql/schemas/getElevatorMaintenanceHistory';
import {
  GetElevatorMaintenanceHistoryQuery,
  GetElevatorMaintenanceHistoryQueryVariables,
  RepairJob,
} from '@/graphql/types/client/generated_types';
import { DEFAULT_PAGINATION, DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_OFFSET } from '@/shared/constants';
import { getItemsFromQuery, removeTypeNamesFromArray } from '@/shared/utils';

export type UseElevatorMaintenanceHistoryTable = {
  elevatorMaintenanceHistory: RepairJob[];
  loading: boolean;
  error?: string;
  hasMore: boolean;
  onNext: () => Promise<void>;
};

export const useElevatorMaintenanceHistory = (elevatorId: string): UseElevatorMaintenanceHistoryTable => {
  const { data, loading, error, fetchMore } = useQuery<
    GetElevatorMaintenanceHistoryQuery,
    GetElevatorMaintenanceHistoryQueryVariables
  >(GET_ELEVATOR_MAINTENANCE_HISTORY, {
    variables: {
      elevatorId,
      paginationOptions: DEFAULT_PAGINATION,
    },
    notifyOnNetworkStatusChange: true,
    skip: !elevatorId,
  });

  const elevatorMaintenanceHistory = useMemo(
    () => removeTypeNamesFromArray(getItemsFromQuery<RepairJob>(data?.getElevatorMaintenanceHistory)),
    [data?.getElevatorMaintenanceHistory]
  );

  const hasMore = !!data?.getElevatorMaintenanceHistory?.pageInfo?.hasNextPage;

  const onNext = async (): Promise<void> => {
    try {
      if (hasMore) {
        const newOffset = data?.getElevatorMaintenanceHistory.edges.length || DEFAULT_PAGINATION_OFFSET;

        await fetchMore({
          variables: {
            paginationOptions: { offset: newOffset, limit: DEFAULT_PAGINATION_LIMIT },
          },
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return {
    elevatorMaintenanceHistory,
    loading,
    error: error?.message,
    hasMore,
    onNext,
  };
};
