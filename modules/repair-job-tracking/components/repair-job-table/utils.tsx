import { DEFAULT_EMPTY_SEARCH_RESULT_TABLE_MESSAGE, DEFAULT_EMPTY_TABLE_MESSAGE } from './constants';

export const getEmptyTableMessage = (searchTerm: string, hasTableData: boolean): string => {
  if (searchTerm && !hasTableData) {
    return DEFAULT_EMPTY_SEARCH_RESULT_TABLE_MESSAGE;
  }

  if (!hasTableData) {
    return DEFAULT_EMPTY_TABLE_MESSAGE;
  }

  return '';
};
