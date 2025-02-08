import { useEffect, useMemo, useState } from 'react';

import { StorageEntity, sessionStorageWrapper } from '@/shared/storage/storageEntity';
import { StorageTableName } from '@/shared/types';

export type TableStorageState<T = undefined, U = undefined, V = undefined> = {
  sorting?: T;
  filters?: U;
  dateFilter?: V;
};

/**
 * Custom hook to manage and persist state in session storage with nested keys for table state.
 *
 * @param storageKey - The key used for storing and retrieving data from session storage.
 * @param initialValue - The default value for the state if no data is found in session storage.
 * @param tableName - The key for storing the value within an object structure (like `repairJobTable`).
 * @returns An object containing the current state and a function to update it.
 */
const useStoredTableState = <T, U, V>(
  storageKey: string,
  tableName: StorageTableName,
  initialState?: TableStorageState<T, U, V>
) => {
  const storage = useMemo(() => {
    if (typeof window !== 'undefined') {
      return new StorageEntity<{ [key: string]: TableStorageState<T, U, V> }>(storageKey, sessionStorageWrapper);
    }
    return null;
  }, [storageKey]);

  // Initialize state by checking if tableName data exists, or use initialState
  const [storedState, setStoredState] = useState<TableStorageState<T, U, V>>(() => {
    if (typeof window !== 'undefined' && storage) {
      const storedData = storage.getData();
      return storedData?.[tableName] || initialState || {};
    }
    return initialState || {};
  });

  // Update session storage whenever the state changes
  useEffect(() => {
    if (typeof window !== 'undefined' && storage) {
      const currentData = storage.getData() || {};
      storage.setData({
        ...currentData,
        [tableName]: storedState,
      });
    }
  }, [storedState, storage, tableName]);

  return {
    storedState,
    setStoredState,
  };
};

export default useStoredTableState;
