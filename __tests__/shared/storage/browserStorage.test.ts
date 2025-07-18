import { BrowserStorage } from '@/shared/storage/browserStorage';

describe('browserStorage', () => {
  let mockStorage: Storage;
  let browserStorage: BrowserStorage;
  let originalWindow: typeof window;

  const originalEnv = process.env;

  beforeEach(() => {
    originalWindow = global.window;
    process.env = { ...originalEnv, NODE_ENV: 'development' };

    const store: Record<string, string> = {};

    mockStorage = {
      getItem: jest.fn((key: string) => store[key] ?? null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      }),
      clear: jest.fn(),
      key: jest.fn(),
      length: 0,
    };

    browserStorage = new BrowserStorage(mockStorage);

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    global.window = originalWindow;
    process.env = originalEnv;
  });

  describe('getData', () => {
    it('should returns parsed data when valid JSON is stored', () => {
      const testKey = 'key';
      const value = { status: 'test-status' };

      mockStorage.getItem = jest.fn(() => JSON.stringify(value));

      const result = browserStorage.getData<typeof value>(testKey);

      expect(result).toEqual(value);
    });

    it('should return undefined and logs error when JSON.parse fails in development', () => {
      mockStorage.getItem = jest.fn(() => 'bad-json');

      const result = browserStorage.getData('key');

      expect(result).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith('Failed to get data from storage:', expect.any(SyntaxError));
    });

    it('should return undefined when item is not found', () => {
      mockStorage.getItem = jest.fn(() => null);

      const result = browserStorage.getData('missing');

      expect(result).toBeUndefined();
    });
  });

  describe('setData', () => {
    it('should store the value as JSON', () => {
      const key = 'storeKey';
      const value = { capacity: 123 };

      browserStorage.setData(key, value);

      expect(mockStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
    });

    it('should log error if storage setItem fails in development', () => {
      mockStorage.setItem = jest.fn(() => {
        throw new Error('Test error in dev environment');
      });

      browserStorage.setData('key', { capacity: 10 });

      expect(console.error).toHaveBeenCalledWith('Failed to set data to storage:', expect.any(Error));
    });
  });

  describe('removeData', () => {
    it('should remove the item from storage', () => {
      browserStorage.removeData('removeKey');

      expect(mockStorage.removeItem).toHaveBeenCalledWith('removeKey');
    });

    it('should log error if removeItem fails in development', () => {
      mockStorage.removeItem = jest.fn(() => {
        throw new Error('Remove failed in development');
      });

      browserStorage.removeData('key');

      expect(console.error).toHaveBeenCalledWith('Failed to remove from storage:', expect.any(Error));
    });
  });
});
