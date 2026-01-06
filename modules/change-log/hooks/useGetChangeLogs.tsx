import { GET_CHANGE_LOGS } from '@/graphql/schemas/getChangeLogs';
import { GetChangeLogsQuery } from '@/graphql/types/client/generated_types';
import { DEFAULT_PAGINATION } from '@/shared/constants';
import { useGetPaginatedList } from '@/shared/paginated-list-page/hooks';
import { ChangeLog } from '@/shared/types';
import { getItemsFromQuery, removeTypeNamesFromArray } from '@/shared/utils';

import { ChangeLogState } from '../types';

export const useGetChangeLogs = (): ChangeLogState => {
  const {
    data: changeLogs,
    error,
    onNext,
    hasMore,
    isEmpty,
    isInitialLoading,
  } = useGetPaginatedList<GetChangeLogsQuery, ChangeLog>({
    query: GET_CHANGE_LOGS,
    queryVariables: { paginationOptions: DEFAULT_PAGINATION },
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
    onNext,
    isChangeLogEmpty: isEmpty,
    isInitialLoading,
    totalChangeLogsLength: changeLogs.length,
  };
};
