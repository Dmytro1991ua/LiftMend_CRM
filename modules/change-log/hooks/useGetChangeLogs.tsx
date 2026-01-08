import { useMemo } from 'react';

import { SortingState } from '@tanstack/react-table';

import { GET_CHANGE_LOGS } from '@/graphql/schemas/getChangeLogs';
import { GetChangeLogsQuery } from '@/graphql/types/client/generated_types';
import { PageFilters } from '@/shared/base-table/types';
import { convertStoredFiltersToQueryFormat } from '@/shared/base-table/utils';
import { CHANGE_LOG_ACTIONS_STATE_STORAGE_KEY, DEFAULT_PAGINATION } from '@/shared/constants';
import { useGetPaginatedList } from '@/shared/paginated-list-page/hooks';
import useStoredTableState from '@/shared/storage/hooks/useStoredState';
import { ChangeLog, StorageEntityName } from '@/shared/types';
import { getItemsFromQuery, removeTypeNamesFromArray } from '@/shared/utils';

import { ChangeLogState } from '../types';

export const useGetChangeLogs = (): ChangeLogState => {
  const { storedState: changeLogPageStoredState, setStoredState } = useStoredTableState<
    SortingState,
    PageFilters,
    undefined
  >(CHANGE_LOG_ACTIONS_STATE_STORAGE_KEY, StorageEntityName.ChangeLogPage);

  const filterValues = useMemo(
    () => changeLogPageStoredState.filters?.filterValues || {},
    [changeLogPageStoredState.filters?.filterValues]
  );

  const filters = useMemo(
    () =>
      convertStoredFiltersToQueryFormat(filterValues, {
        selectedAction: 'action',
        selectedEntityType: 'entityType',
        selectedUserId: 'userId',
      }),
    [filterValues]
  );

  const {
    data: changeLogs,
    error,
    onNext,
    hasMore,
    isEmpty,
    isInitialLoading,
  } = useGetPaginatedList<GetChangeLogsQuery, ChangeLog>({
    query: GET_CHANGE_LOGS,
    queryVariables: { paginationOptions: DEFAULT_PAGINATION, filterOptions: filters },
    queryOptions: {
      fetchPolicy: 'network-only',
    },
    getData: (data) => removeTypeNamesFromArray(getItemsFromQuery<ChangeLog>(data?.getChangeLogs)),
    getPageInfo: (data) => data?.getChangeLogs?.pageInfo,
    getNextOffset: (data) => data?.getChangeLogs.edges.length,
  });

  return {
    changeLogs,
    error,
    hasMore,
    changeLogPageStoredState,
    onSetChangeLogPageStoredState: setStoredState,
    onNext,
    isChangeLogEmpty: isEmpty,
    isInitialLoading,
    totalChangeLogsLength: changeLogs.length,
  };
};
