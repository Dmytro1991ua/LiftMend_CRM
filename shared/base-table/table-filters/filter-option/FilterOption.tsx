import { useCallback, useMemo } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { DropdownOption } from '@/shared/base-select/types';

import { FilterKey, FilterType } from '../../types';

export type FilterOptionProps = {
  filterKey: FilterKey;
  option: DropdownOption;
  isSelected: boolean;
  filterType: FilterType;
  onFilterChange: (filterKey: FilterKey, option: DropdownOption, filterType?: FilterType) => void;
};

const FilterOption = ({ option, isSelected, filterKey, filterType, onFilterChange }: FilterOptionProps) => {
  const onHandleCheckboxChange = useCallback(() => {
    onFilterChange(filterKey, option, 'checkbox');
  }, [onFilterChange, filterKey, option]);

  const onHandleRadioButtonChange = useCallback(() => {
    onFilterChange(filterKey, option, 'radio');
  }, [onFilterChange, filterKey, option]);

  const filterOptionConfig = useMemo(
    () => ({
      checkbox: (
        <>
          <Checkbox
            checked={isSelected}
            data-testid='filter-checkbox'
            id={`checkbox-${filterKey}_${option.value}`}
            onCheckedChange={onHandleCheckboxChange}
          />
          <label className='text-sm font-semibold' htmlFor={`checkbox-${filterKey}_${option.value}`}>
            {option.label}
          </label>
        </>
      ),
      radio: (
        <>
          <input
            checked={isSelected}
            className='form-radio h-4 w-4 text-blue-600'
            data-testid='filter-radio'
            id={`radio-${filterKey}_${option.value}`}
            type='radio'
            onChange={onHandleRadioButtonChange}
          />
          <label className='text-sm font-semibold' htmlFor={`radio-${filterKey}_${option.value}`}>
            {option.label}
          </label>
        </>
      ),
    }),
    [isSelected, filterKey, option, onHandleCheckboxChange, onHandleRadioButtonChange]
  );

  return (
    <div key={option.value} className='flex gap-2 p-2 border-b-[0.5px]'>
      {filterOptionConfig[filterType] || null}
    </div>
  );
};

export default FilterOption;
