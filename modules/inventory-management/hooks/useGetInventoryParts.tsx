import { useMemo } from 'react';

import { ApolloQueryResult, useQuery } from '@apollo/client';

import { GET_INVENTORY_PARTS } from '@/graphql/schemas/getInventoryParts';
import { GetInventoryPartsQuery, GetInventoryPartsQueryVariables } from '@/graphql/types/client/generated_types';
import { DEFAULT_PAGINATION, DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_OFFSET } from '@/shared/constants';
import { InventoryPart } from '@/shared/types';
import { getItemsFromQuery, removeTypeNamesFromArray } from '@/shared/utils';

export type UseGetInventoryParts = {
  inventoryParts: InventoryPart[];
  loading: boolean;
  hasMore: boolean;
  error?: string;
  onNext: () => Promise<void>;
  refetch: (variables?: Partial<GetInventoryPartsQueryVariables>) => Promise<ApolloQueryResult<GetInventoryPartsQuery>>;
};

export const useGetInventoryParts = (): UseGetInventoryParts => {
  const { data, error, loading, fetchMore, refetch } = useQuery<
    GetInventoryPartsQuery,
    GetInventoryPartsQueryVariables
  >(GET_INVENTORY_PARTS, {
    variables: {
      paginationOptions: DEFAULT_PAGINATION,
    },
    notifyOnNetworkStatusChange: true,
  });

  const inventoryParts = useMemo(
    () => removeTypeNamesFromArray(getItemsFromQuery<InventoryPart>(data?.getInventoryParts)),
    [data?.getInventoryParts]
  );

  const hasMore = !!data?.getInventoryParts?.pageInfo?.hasNextPage;

  const onNext = async (): Promise<void> => {
    try {
      if (hasMore) {
        const newOffset = data?.getInventoryParts.edges.length || DEFAULT_PAGINATION_OFFSET;

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
    inventoryParts,
    loading,
    hasMore,
    error: error?.message,
    onNext,
    refetch,
  };
};
