import { useMemo } from 'react';

import { GetInventoryPartsQuery, GetInventoryPartsQueryVariables } from '@/graphql/types/client/generated_types';
import BaseTable from '@/shared/base-table';
import { useSearchInTable } from '@/shared/base-table/hooks';
import { RowHighlightInfo } from '@/shared/base-table/types';
import { getEmptyTableMessage, getRowHighlightInfo } from '@/shared/base-table/utils';
import QueryResponse from '@/shared/query-response';
import { InventoryPart, TableNames } from '@/shared/types';
import { NOOP } from '@/shared/utils';

import {
  DEFAULT_INVENTORY_PARTS_TABLE_EMPTY_TABLE_MESSAGE,
  DEFAULT_INVENTORY_PART_MANAGEMENT_SEARCH_INPUT_PLACEHOLDER,
  INVENTORY_PART_FILTER_CONFIG,
} from '../../constants';
import { useGetInventoryParts } from '../../hooks';

import { INVENTORY_PART_MANAGEMENT_COLUMNS } from './columns';

const InventoryPartsTable = () => {
  const { inventoryParts, error, loading, hasMore, tableStorageState, onSetTableStorageState, onNext, refetch } =
    useGetInventoryParts<InventoryPart>();

  const { searchTerm } = useSearchInTable<InventoryPart, GetInventoryPartsQueryVariables, GetInventoryPartsQuery>({
    tableStorageState,
    onSetTableStorageState,
    refetch,
  });

  const emptyTableMessage = useMemo(
    () => getEmptyTableMessage(searchTerm, !!inventoryParts.length, DEFAULT_INVENTORY_PARTS_TABLE_EMPTY_TABLE_MESSAGE),
    [searchTerm, inventoryParts.length]
  );

  const getInventoryPartRowHighlightInfo = (rowData: InventoryPart): RowHighlightInfo => {
    const highlightInfoStateMap: Record<string, RowHighlightInfo> = {
      'In Stock': getRowHighlightInfo(rowData, (data) => data.status === 'In Stock', 'bg-green-50 hover:bg-green-50'),
      'Low Stock': getRowHighlightInfo(
        rowData,
        (data) => data.status === 'Low Stock',
        'bg-yellow-50 hover:bg-yellow-50'
      ),
      'Out of Stock': getRowHighlightInfo(
        rowData,
        (data) => data.status === 'Out of Stock',
        'bg-red-50 hover:bg-red-50'
      ),
    };

    return highlightInfoStateMap[rowData.status] || {};
  };

  return (
    <>
      <QueryResponse
        errorDescription={error}
        errorMessage='Failed to fetch inventory parts data'
        isErrorOccurred={!!error}
      />
      <BaseTable<InventoryPart, GetInventoryPartsQueryVariables, GetInventoryPartsQuery>
        className='h-[48rem]'
        columns={INVENTORY_PART_MANAGEMENT_COLUMNS}
        data={inventoryParts}
        emptyTableMessage={emptyTableMessage}
        errorMessage={error}
        filtersConfig={INVENTORY_PART_FILTER_CONFIG}
        getRowHighlightInfo={getInventoryPartRowHighlightInfo}
        hasMore={hasMore}
        isCalculatedWidthEnabled={false}
        isRowDisabled={() => false}
        loadMore={onNext}
        loading={loading}
        refetch={refetch}
        searchFieldPlaceholder={DEFAULT_INVENTORY_PART_MANAGEMENT_SEARCH_INPUT_PLACEHOLDER}
        tableName={TableNames.InventoryPartManagementTable}
        tableStorageState={tableStorageState}
        onHandleRowClick={NOOP}
        onSetTableStorageState={onSetTableStorageState}
      />
    </>
  );
};

export default InventoryPartsTable;
