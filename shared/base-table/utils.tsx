import { SortingState } from '@tanstack/react-table';
import { format } from 'date-fns';
import { snakeCase as _snakeCase, toUpper as _toUpper } from 'lodash';
import { NextRouter } from 'next/router';
import { Hourglass } from 'react-loader-spinner';

import { OrderOption } from '@/graphql/types/client/generated_types';
import { AppRoutes } from '@/types/enums';

import BaseAlert from '../base-alert/BaseAlert';
import { TableStorageState } from '../storage/hooks/useStoredState';

import {
  DEFAULT_EMPTY_SEARCH_RESULT_TABLE_MESSAGE,
  DEFAULT_EMPTY_TABLE_MESSAGE,
  DEFAULT_TABLE_ERROR_TITLE,
} from './constants';
import { FilterValues, Nullable, RowHighlightInfo, TableFilters, TableStatus } from './types';

export const getTableStatusContent = (
  emptyTableMessage?: string,
  errorMessage?: string
): Record<TableStatus, React.JSX.Element> => {
  return {
    [TableStatus.Loading]: (
      <div className='flex items-center justify-center'>
        <Hourglass
          ariaLabel='hourglass-loading'
          colors={['#306cce', '#72a1ed']}
          height='50'
          visible={true}
          width='50'
        />
      </div>
    ),
    [TableStatus.Error]: (
      <BaseAlert
        className='flex gap-2 w-[40rem] mx-auto'
        description={errorMessage}
        title={DEFAULT_TABLE_ERROR_TITLE}
        variant='destructive'
      />
    ),
    [TableStatus.Empty]: <h3 className='text-link'>{emptyTableMessage || DEFAULT_EMPTY_TABLE_MESSAGE}</h3>,
  };
};

export const formatTableSortingToQueryFormat = <T,>(
  tableStorageState: TableStorageState<SortingState, TableFilters<T>>
) => {
  const sorting = tableStorageState?.sorting;

  if (!sorting?.length) {
    return { field: null, order: null };
  }

  const { id, desc } = sorting[0];

  return {
    field: _toUpper(_snakeCase(id)),
    order: desc ? OrderOption.Desc : OrderOption.Asc,
  };
};

export const formatDate = (value: Nullable<Date | undefined>, shortYearFormat = false): string => {
  if (!value) return '';

  return format(value, `MM/dd/yy${shortYearFormat ? '' : 'yy'}`);
};

export const getEmptyTableMessage = (searchTerm: string, hasTableData: boolean, noTableDataMessage: string): string => {
  if (searchTerm && !hasTableData) {
    return DEFAULT_EMPTY_SEARCH_RESULT_TABLE_MESSAGE;
  }

  if (!hasTableData) {
    return noTableDataMessage;
  }

  return '';
};

export const convertStoredFiltersToQueryFormat = (
  filterValues: FilterValues,
  filterKeyMap: Record<string, string>
): Record<string, string[]> =>
  Object.fromEntries(
    Object.entries(filterValues || {}).map(([key, value]) => {
      // map stored filter key to query filter key
      const queryFilterKey = filterKeyMap[key] || key;

      // transform dropdown value to array for GraphQL query format (e.g., ['value1', 'value2'])
      const transformedValue = value.map?.((item) => item.value) || value;

      return [queryFilterKey, transformedValue];
    })
  );

export const onHandleRowClick = ({ id, route, router }: { id: string; router: NextRouter; route: AppRoutes }) => {
  // Check if any text is selected by the user (e.g., for copying)
  const selectedText = window.getSelection()?.toString();

  // If no text is selected, proceed to navigate to the repair job detail page
  if (!selectedText) {
    router.push(`${route}/${id}`);
  }
};

export const getRowHighlightInfo = <T,>(
  rowData: T,
  shouldHighlight: (data: T) => boolean,
  highlightClasses: string
): RowHighlightInfo => {
  const isRowHighlighted = shouldHighlight(rowData);
  const highlightStyles = isRowHighlighted ? highlightClasses : '';

  return {
    isHighlighted: isRowHighlighted,
    highlightStyles,
  };
};
