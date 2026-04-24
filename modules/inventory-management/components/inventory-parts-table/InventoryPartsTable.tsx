import { GetInventoryPartsQuery, GetInventoryPartsQueryVariables } from '@/graphql/types/client/generated_types';
import BaseTable from '@/shared/base-table';
import QueryResponse from '@/shared/query-response';
import { InventoryPart, TableNames } from '@/shared/types';
import { NOOP } from '@/shared/utils';

import { DEFAULT_INVENTORY_PART_MANAGEMENT_SEARCH_INPUT_PLACEHOLDER } from '../../constants';
import { useGetInventoryParts } from '../../hooks';

import { INVENTORY_PART_MANAGEMENT_COLUMNS } from './columns';

const InventoryPartsTable = () => {
  const { inventoryParts, error, loading, hasMore, onNext, refetch } = useGetInventoryParts();

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
        emptyTableMessage=''
        errorMessage={error}
        filtersConfig={[]}
        hasMore={hasMore}
        isCalculatedWidthEnabled={false}
        isRowDisabled={() => false}
        loadMore={onNext}
        loading={loading}
        refetch={refetch}
        searchFieldPlaceholder={DEFAULT_INVENTORY_PART_MANAGEMENT_SEARCH_INPUT_PLACEHOLDER}
        tableName={TableNames.InventoryPartManagementTable}
        tableStorageState={{}}
        onHandleRowClick={NOOP}
        onSetTableStorageState={NOOP}
      />
    </>
  );
};

export default InventoryPartsTable;
