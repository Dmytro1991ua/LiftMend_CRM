import { useState } from 'react';

import { Column } from '@tanstack/react-table';

type UseCustomizeColumns<T> = {
  allAvailableColumns: Column<T, unknown>[];
  visibleColumns: Record<string, boolean>;
  onToggleColumnVisibility: (id: string, toggleVisibility: (value: boolean) => void, isVisible: boolean) => void;
};

const useCustomizeColumns = <T,>(columns: Column<T, unknown>[]): UseCustomizeColumns<T> => {
  // Initialize local state based on the columns' visibility
  const initialVisibility = columns.reduce((acc, col) => {
    acc[col.id] = col.getIsVisible();

    return acc;
  }, {} as Record<string, boolean>);

  const [visibleColumns, setVisibleColumns] = useState(initialVisibility);

  const allAvailableColumns = columns.reduce<Column<T, unknown>[]>((acc, column) => {
    if (typeof column.accessorFn !== 'undefined' && column.getCanHide()) {
      acc.push(column);
    }

    return acc;
  }, [] as Column<T, unknown>[]);

  /**
   * Toggles the visibility of a specific column.
   *
   * @param id - The ID of the column to toggle.
   * @param toggleVisibility - A function provided by react-table to toggle column visibility.
   * @param isVisible - The new visibility state for the column.
   */
  const onToggleColumnVisibility = (id: string, toggleVisibility: (value: boolean) => void, isVisible: boolean) => {
    toggleVisibility(isVisible);

    setVisibleColumns((prev) => ({ ...prev, [id]: isVisible }));
  };

  return { allAvailableColumns, visibleColumns, onToggleColumnVisibility };
};

export default useCustomizeColumns;
