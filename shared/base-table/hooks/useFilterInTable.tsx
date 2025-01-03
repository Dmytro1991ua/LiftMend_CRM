import { useCallback, useMemo } from 'react';

import { DropdownOption } from '@/shared/base-select/types';

import { FilterKey, FilterType, TableFilters } from '../types';

import { BaseHookProps, UseFilterInTable } from './types';

const useFilterInTable = <T,>({ tableStorageState, onSetTableStorageState }: BaseHookProps<T>): UseFilterInTable<T> => {
  const filters = useMemo(() => tableStorageState.filters || {}, [tableStorageState.filters]);

  const onFilterChange = useCallback(
    (key: FilterKey, selectedOption: DropdownOption, filterType?: FilterType) => {
      onSetTableStorageState((prevTableState) => {
        const storedFiltersValue = filters.filterValues?.[key] || [];
        const isFilterValueExistInStorage = storedFiltersValue.some((option) => option.value === selectedOption.value);

        let updatedFilterValues;

        if (filterType === 'radio') {
          // For radio buttons, replace existing values with the single, selected value
          updatedFilterValues = [selectedOption];
        } else {
          // For checkboxes, toggle the selected value(s)
          updatedFilterValues = isFilterValueExistInStorage
            ? storedFiltersValue.filter((option) => option.value !== selectedOption.value)
            : [...storedFiltersValue, selectedOption];
        }

        const updatedFilters: TableFilters<T> = {
          ...prevTableState.filters,
          filterValues: {
            ...prevTableState?.filters?.filterValues,
            [key]: updatedFilterValues,
          },
        };

        return {
          ...prevTableState,
          filters: updatedFilters,
        };
      });
    },
    [filters, onSetTableStorageState]
  );

  const onClearFilter = useCallback(
    (key: FilterKey) => {
      onSetTableStorageState((prevTableState) => {
        const updatedFilters: TableFilters<T> = {
          ...prevTableState.filters,
          filterValues: {
            ...prevTableState?.filters?.filterValues,
            [key]: [],
          },
        };

        return {
          ...prevTableState,
          filters: updatedFilters,
        };
      });
    },
    [onSetTableStorageState]
  );

  return {
    filters,
    onFilterChange,
    onClearFilter,
  };
};

export default useFilterInTable;
