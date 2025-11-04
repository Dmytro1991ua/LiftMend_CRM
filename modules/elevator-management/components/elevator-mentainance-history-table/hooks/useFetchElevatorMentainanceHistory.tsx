import { useMemo } from 'react';

import { useQuery } from '@apollo/client';

import { GET_ELEVATOR_MENTAINANCE_HISTORY } from '@/graphql/schemas/getElevatorMentainanceHistory';
import {
  GetElevatorMentainanceHistoryQuery,
  GetElevatorMentainanceHistoryQueryVariables,
  RepairJob,
} from '@/graphql/types/client/generated_types';
import { DEFAULT_PAGINATION, DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_OFFSET } from '@/shared/constants';
import { getItemsFromQuery, removeTypeNamesFromArray } from '@/shared/utils';

export type UseElevatorMentainanceHistoryTable = {
  elevatorMentainanceHistory: RepairJob[];
  loading: boolean;
  error?: string;
  hasMore: boolean;
  onNext: () => Promise<void>;
};

export const useElevatorMentainanceHistory = (
  buildingName: string,
  elevatorLocation: string
): UseElevatorMentainanceHistoryTable => {
  const { data, loading, error, fetchMore } = useQuery<
    GetElevatorMentainanceHistoryQuery,
    GetElevatorMentainanceHistoryQueryVariables
  >(GET_ELEVATOR_MENTAINANCE_HISTORY, {
    variables: {
      buildingName,
      elevatorLocation,
      paginationOptions: DEFAULT_PAGINATION,
    },
    notifyOnNetworkStatusChange: true,
    skip: !buildingName || !elevatorLocation,
  });

  const elevatorMentainanceHistory = useMemo(
    () => removeTypeNamesFromArray(getItemsFromQuery<RepairJob>(data?.getElevatorMentainanceHistory)),
    [data?.getElevatorMentainanceHistory]
  );

  const hasMore = !!data?.getElevatorMentainanceHistory?.pageInfo?.hasNextPage;

  const onNext = async (): Promise<void> => {
    try {
      if (hasMore) {
        const newOffset = data?.getElevatorMentainanceHistory.edges.length || DEFAULT_PAGINATION_OFFSET;

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
    elevatorMentainanceHistory,
    loading,
    error: error?.message,
    hasMore,
    onNext,
  };
};
