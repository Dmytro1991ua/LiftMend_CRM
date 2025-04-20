import { mockElevatorRecord } from '@/mocks/elevatorManagementMocks';
import { isElevatorRecordRowDisabled } from '@/modules/elevator-management/components/elevator-management-table/utils';

describe('isElevatorRecordRowDisabled', () => {
  it('should return false if elevator record does not have Out of Service status', () => {
    expect(isElevatorRecordRowDisabled(mockElevatorRecord)).toBe(false);
  });

  it('should return true if elevator record has Out of Service status', () => {
    expect(isElevatorRecordRowDisabled({ ...mockElevatorRecord, status: 'Out of Service' })).toBe(true);
  });
});
