import { Dispatch, SetStateAction, useMemo } from 'react';

import { ApolloQueryResult, useQuery } from '@apollo/client';
import { SortingState } from '@tanstack/react-table';

import { GET_INVENTORY_PARTS } from '@/graphql/schemas/getInventoryParts';
import {
  GetInventoryPartsQuery,
  GetInventoryPartsQueryVariables,
  InventoryPartSortField,
} from '@/graphql/types/client/generated_types';
import { TableFilters } from '@/shared/base-table/types';
import { convertStoredFiltersToQueryFormat, formatTableSortingToQueryFormat } from '@/shared/base-table/utils';
import {
  DEFAULT_PAGINATION,
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET,
  TABLE_STATE_STORAGE_KEY,
} from '@/shared/constants';
import { EntityStorageState } from '@/shared/storage/hooks/useStoredEntityState';
import useStoredTableState from '@/shared/storage/hooks/useStoredState';
import { InventoryPart, StorageEntityName } from '@/shared/types';
import { getItemsFromQuery, removeTypeNamesFromArray } from '@/shared/utils';

import { INVENTORY_PARTS_TABLE_FILTER_KEY_MAP } from '../constants';

export type UseGetInventoryParts<T> = {
  inventoryParts: InventoryPart[];
  loading: boolean;
  hasMore: boolean;
  error?: string;
  onNext: () => Promise<void>;
  tableStorageState: EntityStorageState<SortingState, TableFilters<T>>;
  onSetTableStorageState: Dispatch<SetStateAction<EntityStorageState<SortingState, TableFilters<T>>>>;
  refetch: (variables?: Partial<GetInventoryPartsQueryVariables>) => Promise<ApolloQueryResult<GetInventoryPartsQuery>>;
};

export const useGetInventoryParts = <T,>(): UseGetInventoryParts<T> => {
  const { storedState: tableStorageState, setStoredState: setTableState } = useStoredTableState<
    SortingState,
    TableFilters<T>,
    undefined
  >(TABLE_STATE_STORAGE_KEY, StorageEntityName.InventoryPartsPage, undefined);

  const { field, order } = useMemo(() => formatTableSortingToQueryFormat(tableStorageState), [tableStorageState]);

  const searchTerm = useMemo(
    () => tableStorageState.filters?.searchTerm || '',
    [tableStorageState.filters?.searchTerm]
  );

  const filterValues = useMemo(
    () => tableStorageState.filters?.filterValues || {},
    [tableStorageState.filters?.filterValues]
  );

  const filters = useMemo(
    () => convertStoredFiltersToQueryFormat(filterValues, INVENTORY_PARTS_TABLE_FILTER_KEY_MAP),
    [filterValues]
  );

  const { data, error, loading, fetchMore, refetch } = useQuery<
    GetInventoryPartsQuery,
    GetInventoryPartsQueryVariables
  >(GET_INVENTORY_PARTS, {
    variables: {
      paginationOptions: DEFAULT_PAGINATION,
      sortOptions: {
        field: field as InventoryPartSortField,
        order,
      },
      filterOptions: {
        searchTerm,
        ...filters,
      },
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
            filterOptions: { searchTerm, ...filters },
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
    tableStorageState,
    onSetTableStorageState: setTableState,
    refetch,
  };
};
