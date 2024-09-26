import { useCallback, useMemo } from 'react';

import { DropdownOption } from '@/shared/base-select/types';

import { FilterKey, TableFilters } from '../types';

import { BaseHookProps, UseFilterInTable } from './types';

const useFilterInTable = <T,>({ tableStorageState, onSetTableStorageState }: BaseHookProps<T>): UseFilterInTable<T> => {
  const filters = useMemo(() => tableStorageState.filters || {}, [tableStorageState.filters]);

  const onFilterChange = useCallback(
    (key: FilterKey, selectedOption: DropdownOption) => {
      onSetTableStorageState((prevTableState) => {
        const storedFiltersValue = filters.filterValues?.[key] || [];
        const isFilterValueExistInStorage = filters.filterValues?.[key]?.some(
          (option) => option.value === selectedOption.value
        );

        const updatedFilterValues = isFilterValueExistInStorage
          ? storedFiltersValue.filter((option) => option.value !== selectedOption.value)
          : [...storedFiltersValue, selectedOption];

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
