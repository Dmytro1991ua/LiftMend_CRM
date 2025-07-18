import { sessionStorageWrapper } from '@/shared/storage/storageEntity';

describe('storageEntity', () => {
  describe('StorageEntity', () => {
    const key = 'test-key';
    const value = { id: 1, label: 'item' };

    beforeEach(() => {
      sessionStorage.clear();

      jest.spyOn(Storage.prototype, 'setItem');
      jest.spyOn(Storage.prototype, 'getItem');
      jest.spyOn(Storage.prototype, 'removeItem');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should store data using JSON.stringify', () => {
      sessionStorageWrapper.setData(key, value);

      expect(sessionStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
    });

    it('should retrieve parsed data from sessionStorage', () => {
      sessionStorage.setItem(key, JSON.stringify(value));

      const result = sessionStorageWrapper.getData<typeof value>(key);

      expect(result).toEqual(value);
    });

    it('should return undefined if data is not found', () => {
      const result = sessionStorageWrapper.getData('missing-key');

      expect(result).toBeUndefined();
    });

    it('should remove data from sessionStorage', () => {
      sessionStorageWrapper.removeData(key);
      expect(sessionStorage.removeItem).toHaveBeenCalledWith(key);
    });
  });

  describe('sessionStorageWrapper', () => {
    const key = 'test-key';
    const value = { id: 1, label: 'item' };

    beforeEach(() => {
      sessionStorage.clear();

      jest.spyOn(Storage.prototype, 'setItem');
      jest.spyOn(Storage.prototype, 'getItem');
      jest.spyOn(Storage.prototype, 'removeItem');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should store data using JSON.stringify', () => {
      sessionStorageWrapper.setData(key, value);

      expect(sessionStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
    });

    it('should retrieve parsed data from sessionStorage', () => {
      sessionStorage.setItem(key, JSON.stringify(value));

      const result = sessionStorageWrapper.getData<typeof value>(key);

      expect(result).toEqual(value);
    });

    it('should return undefined if data is not found', () => {
      const result = sessionStorageWrapper.getData('missing-key');

      expect(result).toBeUndefined();
    });

    it('should remove data from sessionStorage', () => {
      sessionStorageWrapper.removeData(key);

      expect(sessionStorage.removeItem).toHaveBeenCalledWith(key);
    });
  });
});
