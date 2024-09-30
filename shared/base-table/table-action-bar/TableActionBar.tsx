import { Column, RowModel } from '@tanstack/react-table';

import SearchInput from '@/shared/base-input/search-input';
import { DropdownOption } from '@/shared/base-select/types';
import TableFilters from '@/shared/repair-job/table-filters';
import { TableNames } from '@/shared/types';

import CustomizeColumns from '../customize-columns';
import ExportButton from '../export-button';
import { FilterKey, TableFiltersConfig, TableFilters as TableFiltersType } from '../types';

type TableActionBarProps<T> = {
  searchTerm: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => Promise<void>;
  columns: Column<T, unknown>[];
  filtersConfig: TableFiltersConfig[];
  storedFilters: TableFiltersType<T>;
  onFilterChange: (key: FilterKey, selectedOption: DropdownOption) => void;
  onClearFilter: (key: FilterKey) => void;
  rowModel?: RowModel<T>;
  tableName: TableNames;
  isExportButtonDisabled?: boolean;
};

export const DEFAULT_SEARCH_INPUT_PLACEHOLDER = 'Search by Repair Job ID';

const TableActionBar = <T,>({
  searchTerm,
  storedFilters,
  filtersConfig,
  columns,
  rowModel,
  tableName,
  isExportButtonDisabled,
  onClearSearch,
  onSearch,
  onFilterChange,
  onClearFilter,
}: TableActionBarProps<T>) => {
  console.log(rowModel?.rows);
  return (
    <section className='flex items-center justify-between py-4'>
      <div className='flex items-center gap-2'>
        <TableFilters
          filtersConfig={filtersConfig}
          storedFilters={storedFilters}
          onClearFilter={onClearFilter}
          onFilterChange={onFilterChange}
        />
        <ExportButton<T>
          columns={columns}
          isDisabled={isExportButtonDisabled}
          rowModel={rowModel}
          tableName={tableName}
        />
      </div>
      <div className='flex items-center gap-2 ml-auto'>
        <SearchInput
          isLastElement={true}
          placeholder={DEFAULT_SEARCH_INPUT_PLACEHOLDER}
          value={searchTerm}
          onChange={onSearch}
          onClearSearch={onClearSearch}
        />
        <CustomizeColumns columns={columns} />
      </div>
    </section>
  );
};

export default TableActionBar;
