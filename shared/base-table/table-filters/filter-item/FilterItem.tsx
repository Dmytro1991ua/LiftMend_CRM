import { AccordionContent, AccordionTrigger } from '@/components/ui/accordion';
import { DropdownOption } from '@/shared/base-select/types';
import { FilterKey, FilterLabel, FilterType, TableFilters } from '@/shared/base-table/types';

import FilterHeader from '../filter-header';
import FilterOption from '../filter-option';

import { getIsFilterSelected } from './utils';

export type FilterItemProps<T> = {
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
