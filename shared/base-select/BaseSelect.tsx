import React, { useEffect, useRef, useState } from 'react';

import Select from 'react-select';

import CustomMenuList from './components/custom-menu-list';
import CustomMultiValue from './components/custom-multi-value';
import CustomPlaceholder from './components/custom-placeholder';
import CustomSingleValue from './components/custom-single-value';
import CustomValueContainer from './components/custom-value-container';
import { getBaseSelectStylesConfig } from './config';
import { BaseSelectProps } from './types';

const BaseSelect = <T extends string, IsMulti extends boolean>({
  options,
  value,
  onChange,
  placeholder,
  inputValue,
  onInputChange,
  hasSearchInput,
  onNext,
  hasMore,
  isMultiSelect,
  onClearAll,
  onSelectAll,
  multipleSelectControls,
  closeMenuOnSelect,
  hideSelectedOptions,
  searchInputPlaceholder,
  maxVisibleOptionsCount,
  isClearable,
  isDisabled,
  hasError,
  ...props
}: BaseSelectProps<T, IsMulti>) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isFocused, setIsFocused] = useState<boolean>(false);

  const styles = getBaseSelectStylesConfig<T, IsMulti>(hasError);

  const onHandleFocus = () => setIsFocused(true);
  const onHandleBlur = () => setIsFocused(false);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onHandleBlur();
      }
    };

    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <div ref={containerRef} className='relative'>
      <Select
        captureMenuScroll={closeMenuOnSelect}
        closeMenuOnSelect={closeMenuOnSelect}
        components={{
          // @ts-ignore
          MenuList: CustomMenuList,
          // @ts-ignore
          ValueContainer: CustomValueContainer,
          // @ts-ignore
          MultiValue: CustomMultiValue,
          SingleValue: CustomSingleValue,
          Placeholder: CustomPlaceholder,
        }}
        hasMore={hasMore}
        hasSearchInput={hasSearchInput}
        hideSelectedOptions={hideSelectedOptions}
        inputValue={inputValue}
        isClearable={isClearable}
        isDisabled={isDisabled}
        isFocused={isFocused}
        isMulti={isMultiSelect}
        isSearchable={false}
        maxVisibleOptionsCount={maxVisibleOptionsCount}
        menuIsOpen={isFocused}
        menuPosition='fixed'
        multipleSelectControls={multipleSelectControls}
        options={options}
        placeholder={placeholder}
        searchInputPlaceholder={searchInputPlaceholder}
        styles={styles}
        value={value}
        onChange={onChange}
        onClearAll={onClearAll}
        onFocus={onHandleFocus}
        onInputChange={onInputChange}
        onMenuClose={onHandleBlur}
        onMenuOpen={onHandleFocus}
        onNext={onNext}
        onSelectAll={onSelectAll}
        {...props}
      />
    </div>
  );
};

export default BaseSelect;
