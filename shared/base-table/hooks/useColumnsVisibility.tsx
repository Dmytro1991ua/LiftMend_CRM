import { OnChangeFn, VisibilityState } from '@tanstack/react-table';

import { BaseHookProps, UseColumnsVisibility } from './types';

const useColumnsVisibility = <T,>({
  tableStorageState,
  onSetTableStorageState,
}: BaseHookProps<T>): UseColumnsVisibility => {
  const columnVisibility = tableStorageState.filters?.columnVisibility || {};

  const onToggleColumnVisibility: OnChangeFn<VisibilityState> = (updaterOrValue) => {
    onSetTableStorageState((prevTableState) => {
      const newColumnVisibility =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(prevTableState?.filters?.columnVisibility || {})
          : updaterOrValue;

      return {
        ...prevTableState,
        filters: {
          ...prevTableState.filters,
          columnVisibility: newColumnVisibility,
        },
      };
    });
  };

  return {
    columnVisibility,
    onToggleColumnVisibility,
  };
};

export default useColumnsVisibility;
