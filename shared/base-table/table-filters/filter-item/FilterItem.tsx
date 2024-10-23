import { AccordionContent, AccordionTrigger } from '@/components/ui/accordion';
import { DropdownOption } from '@/shared/base-select/types';
import { FilterKey, FilterLabel, TableFilters } from '@/shared/base-table/types';

import FilterHeader from '../filter-header';
import FilterOption from '../filter-option';

type FilterItemProps<T> = {
  filterKey: FilterKey;
  label: FilterLabel;
  options: DropdownOption[];
  storedFilters: TableFilters<T>;
  onClearFilter: (filterKey: FilterKey) => void;
  onFilterChange: (filterKey: FilterKey, option: DropdownOption) => void;
};

const FilterItem = <T,>({
  filterKey,
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
          const isSelected =
            storedFilters.filterValues?.[filterKey]?.some((opt) => opt.value === option.value) || false;

          return (
            <FilterOption
              key={`${option.value}_${i}`}
              isSelected={isSelected}
              option={option}
              onFilterChange={() => onFilterChange(filterKey, option)}
            />
          );
        })}
      </AccordionContent>
    </>
  );
};

export default FilterItem;
