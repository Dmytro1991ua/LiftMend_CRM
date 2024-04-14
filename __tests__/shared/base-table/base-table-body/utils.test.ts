import { TableStatus } from '@/shared/base-table/types';
import { getTableStatusMod } from '@/shared/base-table/utils';

describe('utils', () => {
  describe('getTableStatusMod', () => {
    it('should return loading table status mode', () => {
      const result = getTableStatusMod(false, true);

      expect(result).toBe(TableStatus.Loading);
    });

    it('should return empty table status mode', () => {
      const result = getTableStatusMod(true);

      expect(result).toBe(TableStatus.Empty);
    });

    it('should return error table status mode', () => {
      const result = getTableStatusMod(false, false, 'Error');

      expect(result).toBe(TableStatus.Error);
    });
  });
});
