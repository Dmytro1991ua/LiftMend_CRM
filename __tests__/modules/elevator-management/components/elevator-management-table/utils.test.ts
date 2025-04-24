import { mockElevatorRecord } from '@/mocks/elevatorManagementMocks';
import { isElevatorRecordRowDisabled } from '@/modules/elevator-management/components/elevator-management-table/utils';

describe('isElevatorRecordRowDisabled', () => {
  it('should return false when table row should not be disabled', () => {
    expect(isElevatorRecordRowDisabled(mockElevatorRecord)).toBe(false);
  });

  it('should return true when table row should be disabled', () => {
    expect(isElevatorRecordRowDisabled({ ...mockElevatorRecord, status: 'Out of Service' })).toBe(true);
  });
});
