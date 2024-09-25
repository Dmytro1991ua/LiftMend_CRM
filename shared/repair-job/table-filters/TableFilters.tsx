import { useCallback, useMemo, useState } from 'react';

import { FaFilter } from 'react-icons/fa';

import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { DropdownOption } from '@/shared/base-select/types';

import { FilterKey, TableFiltersConfig, TableFilters as TableFiltersType } from '../../base-table/types';

import FilterItem from './filter-item';
import { getSelectedFilterCountLabel, getSelectedFiltersCount } from './utils';

type TableFiltersProps<T> = {
  filtersConfig: TableFiltersConfig[];
  storedFilters: TableFiltersType<T>;
  onFilterChange: (key: FilterKey, selectedOption: DropdownOption) => void;
  onClearFilter: (key: FilterKey) => void;
};

const TableFilters = <T,>({ storedFilters, filtersConfig, onFilterChange, onClearFilter }: TableFiltersProps<T>) => {
  const [currentOpenedFilter, setCurrentOpenedFilter] = useState<string | null>(null);

  const handleAccordionChange = useCallback((value: string | null) => setCurrentOpenedFilter(value), []);

  const selectedFiltersCount = useMemo(
    () => getSelectedFiltersCount(storedFilters.filterValues),
    [storedFilters.filterValues]
  );
  const selectedFilterCountLabel = useMemo(
    () => getSelectedFilterCountLabel('Filters', selectedFiltersCount),
    [selectedFiltersCount]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='w-52 h-8 py-5 px-3 bg-primary text-white' size='sm' variant='outline'>
          <FaFilter className='mr-2 h-4 w-4' />
          <span className='uppercase font-bold'>{selectedFilterCountLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-[30rem]'>
        <Accordion
          collapsible
          className={cn(
            'transition-all duration-300 ease-in-out',
            currentOpenedFilter ? 'h-[50rem] overflow-y-auto' : 'h-auto'
          )}
          type='single'
          onValueChange={handleAccordionChange}
        >
          {filtersConfig.map(({ filterKey, label, id, options }) => (
            <AccordionItem key={id} className='px-2 ' value={filterKey}>
              <FilterItem<T>
                key={id}
                filterKey={filterKey}
                label={label}
                options={options}
                storedFilters={storedFilters}
                onClearFilter={onClearFilter}
                onFilterChange={onFilterChange}
              />
            </AccordionItem>
          ))}
        </Accordion>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TableFilters;
