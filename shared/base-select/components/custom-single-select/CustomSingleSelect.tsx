import { ActionMeta } from 'react-select';

import BaseSelect from '../../BaseSelect';
import { DropdownOption, SingleSelectProps, SingleSelectValue } from '../../types';

const CustomSingleSelect = <T extends string>({
  options,
  value,
  onChange,
  placeholder,
  inputValue,
  onInputChange,
  isMultiSelect,
  hasSearchInput,
  closeMenuOnSelect,
  searchInputPlaceholder,
  hasError,
  ...props
}: SingleSelectProps<T>) => {
  const onHandleChange = (value: SingleSelectValue<T>, actionMeta: ActionMeta<DropdownOption<T>>) => {
    onChange && onChange(value, actionMeta);
  };

  return (
    <BaseSelect
      closeMenuOnSelect={closeMenuOnSelect}
      hasError={hasError}
      hasSearchInput={hasSearchInput}
      inputValue={inputValue}
      isMultiSelect={isMultiSelect}
      options={options}
      placeholder={placeholder}
      searchInputPlaceholder={searchInputPlaceholder}
      value={value}
      onChange={onHandleChange}
      onInputChange={onInputChange}
      {...props}
    />
  );
};

export default CustomSingleSelect;
