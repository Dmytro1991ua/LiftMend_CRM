import BaseSelect from '../../BaseSelect';
import { CombinedActionMeta, DropdownOption, MultiSelectProps, MultiSelectValue } from '../../types';

const CustomMultiSelect = <T extends string>({
  options,
  value,
  onChange,
  placeholder,
  inputValue,
  onInputChange,
  onSelectAll,
  onClearAll,
  multipleSelectControls,
  isMultiSelect,
  closeMenuOnSelect,
  hideSelectedOptions,
  searchInputPlaceholder,
  hasError,
  defaultValue,
  ...props
}: MultiSelectProps<T>) => {
  const onHandleChange = (value: MultiSelectValue<T>, actionMeta: CombinedActionMeta<T>) => {
    onChange && onChange(value, actionMeta);
  };

  const onHandleSelectAll = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, options: DropdownOption<T>[]) => {
    e.preventDefault();

    onSelectAll && onSelectAll(e, options);
  };

  const onHandleClearAll = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.preventDefault();

    onClearAll && onClearAll(e);
  };

  return (
    <BaseSelect
      closeMenuOnSelect={closeMenuOnSelect}
      defaultValue={defaultValue}
      hasError={hasError}
      hideSelectedOptions={hideSelectedOptions}
      inputValue={inputValue}
      isMultiSelect={isMultiSelect}
      multipleSelectControls={multipleSelectControls}
      options={options}
      placeholder={placeholder}
      searchInputPlaceholder={searchInputPlaceholder}
      value={value}
      onChange={onHandleChange}
      onClearAll={onHandleClearAll}
      onInputChange={onInputChange}
      onSelectAll={onHandleSelectAll}
      {...props}
    />
  );
};

export default CustomMultiSelect;
