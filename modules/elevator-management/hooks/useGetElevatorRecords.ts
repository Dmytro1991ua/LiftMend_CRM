import { useMemo } from 'react';

import { useQuery } from '@apollo/client';

import { GET_ELEVATOR_RECORDS } from '@/graphql/schemas';
import { GetElevatorRecordsQuery, QueryGetElevatorRecordsArgs } from '@/graphql/types/client/generated_types';
import { DEFAULT_PAGINATION, DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_OFFSET } from '@/shared/constants';
import { ElevatorRecord } from '@/shared/types';
import { getItemsFromQuery, removeTypeNamesFromArray } from '@/shared/utils';

type UseGetElevatorRecords = {
  elevatorRecords: ElevatorRecord[];
  loading: boolean;
  hasMore: boolean;
  error?: string;
  onNext: () => Promise<void>;
};

const useGetElevatorRecords = (): UseGetElevatorRecords => {
  const { data, error, loading, fetchMore } = useQuery<GetElevatorRecordsQuery, QueryGetElevatorRecordsArgs>(
    GET_ELEVATOR_RECORDS,
    {
      variables: {
        paginationOptions: DEFAULT_PAGINATION,
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  const elevatorRecords = useMemo(
    () => removeTypeNamesFromArray(getItemsFromQuery<ElevatorRecord>(data?.getElevatorRecords)),
    [data?.getElevatorRecords]
  );

  const hasMore = !!data?.getElevatorRecords?.pageInfo?.hasNextPage;

  const onNext = async (): Promise<void> => {
    try {
      if (hasMore) {
        const newOffset = data?.getElevatorRecords.edges.length || DEFAULT_PAGINATION_OFFSET;

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

  return { elevatorRecords, loading, hasMore, error: error?.message, onNext };
};

export default useGetElevatorRecords;
