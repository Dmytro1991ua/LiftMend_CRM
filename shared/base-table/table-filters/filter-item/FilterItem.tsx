import { AccordionContent, AccordionTrigger } from '@/components/ui/accordion';
import { DropdownOption } from '@/shared/base-select/types';
import { FilterKey, FilterLabel, FilterType, TableFilters } from '@/shared/base-table/types';

import FilterHeader from '../filter-header';
import FilterOption from '../filter-option';

import { getIsFilterSelected } from './utils';

type FilterItemProps<T> = {
  filterKey: FilterKey;
  filterType?: FilterType;
  label: FilterLabel;
  options: DropdownOption[];
  storedFilters: TableFilters<T>;
  onClearFilter: (filterKey: FilterKey) => void;
  onFilterChange: (filterKey: FilterKey, option: DropdownOption, filterType?: FilterType) => void;
};

const FilterItem = <T,>({
  filterKey,
  filterType,
  label,
  options,
  storedFilters,
  onClearFilter,
  onFilterChange,
}: FilterItemProps<T>) => {
  const selectedFiltersCount = storedFilters.filterValues?.[filterKey]?.length ?? 0;

  return (
    <>
      <AccordionTrigger className=' py-1 hover:no-underline'>
        <FilterHeader
          label={label}
          selectedFiltersCount={selectedFiltersCount}
          onClear={() => onClearFilter(filterKey)}
        />
      </AccordionTrigger>
      <AccordionContent>
        {options.map((option, i) => {
          const isFilterSelected = getIsFilterSelected({
            filterOption: option,
            filterType: filterType as FilterType,
            filters: storedFilters.filterValues?.[filterKey] ?? [],
          });

          return (
            <FilterOption
              key={`${option.value}_${i}`}
              filterKey={filterKey}
              filterType={filterType as FilterType}
              isSelected={isFilterSelected}
              option={option}
              onFilterChange={onFilterChange}
            />
          );
        })}
      </AccordionContent>
    </>
  );
};

export default FilterItem;

// <AccordionContent>
//   {filterType === 'radio' ? (
//     <div className='flex flex-col gap-2'>
//       {options.map((option, i) => (
//         <div key={`${option.value}_${i}`} className='flex gap-2 items-center'>
//           <input
//             type='radio'
//             id={`${filterKey}_${option.value}`}
//             checked={selectedFilters[0]?.value === option.value}
//             onChange={() => onFilterChange(filterKey, option, 'radio')}
//             className='form-radio h-4 w-4 text-blue-600'
//           />
//           <label htmlFor={`${filterKey}_${option.value}`} className='text-sm font-semibold'>
//             {option.label}
//           </label>
//         </div>
//       ))}
//     </div>
//   ) : (
//     options.map((option, i) => {
//       const isSelected = storedFilters.filterValues?.[filterKey]?.some((opt) => opt.value === option.value) || false;

//       return (
//         <FilterOption
//           key={`${option.value}_${i}`}
//           isSelected={isSelected}
//           option={option}
//           onFilterChange={() => onFilterChange(filterKey, option, 'checkbox')}
//         />
//       );
//     })
//   )}
// </AccordionContent>;
