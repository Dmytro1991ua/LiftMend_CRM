import { useCallback, useMemo, useState } from 'react';

import { FaFilter } from 'react-icons/fa';

import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DropdownOption } from '@/shared/base-select/types';
import { useDropdownOpenState } from '@/shared/repair-job/hooks';

import { FilterKey, TableFiltersConfig, TableFilters as TableFiltersType } from '../types';

import FilterItem from './filter-item';
import { getAccordionHeight, getSelectedFilterCountLabel, getSelectedFiltersCount } from './utils';

type TableFiltersProps<T> = {
  filtersConfig: TableFiltersConfig[];
  storedFilters: TableFiltersType<T>;
  onFilterChange: (key: FilterKey, selectedOption: DropdownOption) => void;
  onClearFilter: (key: FilterKey) => void;
  isAccordionAutoHeight?: boolean;
  isDisabled?: boolean;
};

const TableFilters = <T,>({
  storedFilters,
  filtersConfig,
  isAccordionAutoHeight = false,
  isDisabled = false,
  onFilterChange,
  onClearFilter,
}: TableFiltersProps<T>) => {
  const { isDropdownOpen, onHandleDropdownOpenState } = useDropdownOpenState({ isDisabled });
  const [currentOpenedFilter, setCurrentOpenedFilter] = useState<string | null>(null);

  const selectedFiltersCount = useMemo(
    () => getSelectedFiltersCount(storedFilters.filterValues),
    [storedFilters.filterValues]
  );
  const selectedFilterCountLabel = useMemo(
    () => getSelectedFilterCountLabel('Filters', selectedFiltersCount),
    [selectedFiltersCount]
  );

  const handleAccordionChange = useCallback((value: string | null) => setCurrentOpenedFilter(value), []);

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={onHandleDropdownOpenState}>
      <DropdownMenuTrigger asChild>
        <Button className='w-52 h-8 py-5 px-3 bg-primary text-white' disabled={isDisabled} size='sm' variant='default'>
          <FaFilter className='mr-2 h-4 w-4' />
          <span className='uppercase font-bold'>{selectedFilterCountLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-[30rem]'>
        <Accordion
          collapsible
          className={getAccordionHeight(currentOpenedFilter, isAccordionAutoHeight)}
          type='single'
          onValueChange={handleAccordionChange}
        >
          {filtersConfig.map(({ filterKey, filterType, label, id, options }) => (
            <AccordionItem key={id} className='px-2 ' value={filterKey}>
              <FilterItem<T>
                key={id}
                filterKey={filterKey}
                filterType={filterType}
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
