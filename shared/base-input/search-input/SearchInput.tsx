import { FaSearch } from 'react-icons/fa';
import { IoIosCloseCircle } from 'react-icons/io';

import BaseInput from '@/shared/base-input';

type SearchInputProps = {
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLastElement?: boolean;
  placeholder?: string;
  isDisabled?: boolean;
  onClearSearch?: () => Promise<void>;
};

const SearchInput = ({ value, onChange, onClearSearch, isLastElement, placeholder, isDisabled }: SearchInputProps) => {
  return (
    <BaseInput
      disabled={isDisabled}
      endIcon={<IoIosCloseCircle className='text-gray-300' onClick={onClearSearch} />}
      isLastElement={isLastElement}
      name='search'
      placeholder={placeholder}
      startIcon={<FaSearch className='text-gray-300' />}
      value={value}
      onChange={onChange}
    />
  );
};

export default SearchInput;
