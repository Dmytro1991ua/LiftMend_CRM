import { Column } from '@tanstack/react-table';

import SearchInput from '@/shared/base-input/search-input';
import TableFilters from '@/shared/repair-job/table-filters';

import CustomizeColumns from '../customize-columns';

type TableActionBarProps<T> = {
  searchTerm: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => Promise<void>;
  columns: Column<T, unknown>[];
};

export const DEFAULT_SEARCH_INPUT_PLACEHOLDER = 'Search by Repair Job ID';

const TableActionBar = <T,>({ searchTerm, columns, onClearSearch, onSearch }: TableActionBarProps<T>) => {
  return (
    <section className='flex items-center justify-between py-4'>
      <TableFilters />
      <div className=' flex items-center gap-2 ml-auto'>
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
