import SearchInput from '../../../../shared/base-input/search-input';
import { DEFAULT_SEARCH_INPUT_PLACEHOLDER } from '../../constants';

type TableActionBarProps = {
  searchTerm: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => Promise<void>;
};

const TableActionBar = ({ searchTerm, onClearSearch, onSearch }: TableActionBarProps) => {
  return (
    <section className='flex items-center justify-between py-4'>
      <div className='ml-auto'>
        <SearchInput
          isLastElement={true}
          placeholder={DEFAULT_SEARCH_INPUT_PLACEHOLDER}
          value={searchTerm}
          onChange={onSearch}
          onClearSearch={onClearSearch}
        />
      </div>
    </section>
  );
};

export default TableActionBar;
