import { Header, SortingState } from '@tanstack/react-table';
import { snakeCase as _snakeCase, toUpper as _toUpper } from 'lodash';
import { Hourglass } from 'react-loader-spinner';

import { OrderOption } from '@/graphql/types/client/generated_types';

import BaseAlert from '../base-alert/BaseAlert';
import { TableStorageState } from '../storage/hooks/useStoredState';

import { DEFAULT_EMPTY_TABLE_MESSAGE, DEFAULT_TABLE_ERROR_TITLE } from './constants';
import { TableFilters, TableState, TableStatus } from './types';

export const getTableStatusMod = (empty: boolean, loading?: boolean, errorMessage?: string): TableState => {
  if (loading) return TableStatus.Loading;
  if (errorMessage) return TableStatus.Error;
  if (empty) return TableStatus.Empty;

  return null;
};

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

export const calculateColumnSizes = <T extends object>(headers: Header<T, unknown>[]) => {
  const colSizes: { [key: string]: number } = {};

  headers.forEach((header) => {
    const headerId = header.id;
    const columnId = header.column.id;
    colSizes[`--header-${headerId}-size`] = header.getSize();
    colSizes[`--col-${columnId}-size`] = header.column.getSize();
  });

  return colSizes;
};

export const formatTableSortingToQueryFormat = (tableStorageState: TableStorageState<SortingState, TableFilters>) => {
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
