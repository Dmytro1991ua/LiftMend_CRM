import { Column, RowModel } from '@tanstack/react-table';

import SearchInput from '@/shared/base-input/search-input';
import { DropdownOption } from '@/shared/base-select/types';
import TableFilters from '@/shared/base-table/table-filters';
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
  isActionButtonDisabled?: boolean;
  searchFieldPlaceholder?: string;
};

const TableActionBar = <T,>({
  searchTerm,
  storedFilters,
  filtersConfig,
  columns,
  rowModel,
  tableName,
  isActionButtonDisabled,
  searchFieldPlaceholder,
  onClearSearch,
  onSearch,
  onFilterChange,
  onClearFilter,
}: TableActionBarProps<T>) => {
  return (
    <section className='flex items-center justify-between py-4' data-testid='table-action-bar'>
      <div className='flex items-center gap-2'>
        <TableFilters
          filtersConfig={filtersConfig}
          isDisabled={isActionButtonDisabled}
          storedFilters={storedFilters}
          onClearFilter={onClearFilter}
          onFilterChange={onFilterChange}
        />
        <ExportButton<T>
          columns={columns}
          isDisabled={isActionButtonDisabled}
          rowModel={rowModel}
          tableName={tableName}
        />
      </div>
      <div className='flex items-center gap-2 ml-auto'>
        <SearchInput
          isDisabled={isActionButtonDisabled}
          isLastElement={true}
          placeholder={searchFieldPlaceholder}
          value={searchTerm}
          onChange={onSearch}
          onClearSearch={onClearSearch}
        />
        <CustomizeColumns columns={columns} isDisabled={isActionButtonDisabled} />
      </div>
    </section>
  );
};

export default TableActionBar;
