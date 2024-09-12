import type { AppStorage } from '../types';

/**
 * Manages data in a storage entity with a specific key.
 * Provides methods to get, set, and remove data associated with the key.
 */
export class StorageEntity<T> {
  private readonly storageKey: string;
  private storage: AppStorage;

  constructor(storageKey: string, storage: AppStorage) {
    this.storageKey = storageKey;
    this.storage = storage;
  }

  /**
   * Retrieves data associated with the storageKey.
   * @returns The stored data or undefined if not found
   */
  getData(): T | undefined {
    return this.storage.getData<T>(this.storageKey);
  }

  /**
   * Stores data under the storageKey.
   * @param data - The data to store
   */
  setData(data: T): void {
    this.storage.setData(this.storageKey, data);
  }

  /**
   * Removes data associated with the storageKey.
   */
  removeStorageData(): void {
    this.storage.removeData(this.storageKey);
  }
}

/**
 * Provides an implementation of AppStorage using sessionStorage.
 * Supports storing, retrieving, and removing JSON-encoded data.
 */
export const sessionStorageWrapper: AppStorage = {
  getData<T>(key: string): T | undefined {
    const data = sessionStorage.getItem(key);
    return data ? (JSON.parse(data) as T) : undefined;
  },
  setData<T>(key: string, data: T): void {
    sessionStorage.setItem(key, JSON.stringify(data));
  },
  removeData(key: string): void {
    sessionStorage.removeItem(key);
  },
};
