import type { AppStorage } from '../types';

/**
 * Provides an implementation of AppStorage using a generic Storage interface
 * (e.g., localStorage, sessionStorage) for browser-based storage.
 */
export class BrowserStorage implements AppStorage {
  private readonly storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage;
  }

  /**
   * Retrieves data from storage and parses it.
   * @param key - The key of the stored data
   * @returns The parsed data or undefined if not found or an error occurs
   */
  getData = <T>(key: string): T | undefined => {
    if (typeof window === 'undefined') return undefined; // Avoid accessing sessionStorage during SSR

    try {
      const serializedState = this.storage.getItem(key);
      if (serializedState === null) {
        return undefined;
      }

      return JSON.parse(serializedState);
    } catch (error) {
      return undefined;
    }
  };

  /**
   * Stores data in storage as a JSON string.
   * @param key - The key under which to store the data
   * @param value - The data to store
   */
  setData = <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return; // Ensure this only happens in the browser

    try {
      this.storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Ignore write errors
    }
  };

  /**
   * Removes data from storage by key.
   * @param key - The key of the data to remove
   */
  removeData = (key: string): void => {
    if (typeof window === 'undefined') return; // Avoid SSR error

    try {
      this.storage.removeItem(key);
    } catch (error) {
      // Ignore write errors
    }
  };
}
