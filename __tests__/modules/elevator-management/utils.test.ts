import { mockElevatorRecord } from '@/mocks/elevatorManagementMocks';
import {
  convertElevatorRecordToFormValues,
  convertFormFieldsToElevatorRecord,
} from '@/modules/elevator-management/utils';

describe('convertElevatorRecordToFormValues', () => {
  it('should convert a elevator record to form values', () => {
    const mockExpectedOutput = {
      buildingName: 'Skyline Plaza',
      capacity: 5000,
      elevatorLocation: 'Observation Deck',
      elevatorType: 'Scenic Elevator',
      id: 'test_id',
      lastMaintenanceDate: new Date('2024-05-20T10:00:00.000Z'),
      nextMaintenanceDate: new Date('2024-08-30T16:00:00.000Z'),
      status: 'Operational',
    };

    expect(convertElevatorRecordToFormValues(mockElevatorRecord)).toEqual(mockExpectedOutput);
  });

  it('should handle null input gracefully', () => {
    const result = convertElevatorRecordToFormValues(null!);

    const mockExpectedOutput = {
      elevatorType: null,
      capacity: null,
      buildingName: null,
      elevatorLocation: null,
      id: '',
      status: null,
      lastMaintenanceDate: undefined,
      nextMaintenanceDate: undefined,
    };

    expect(result).toEqual(mockExpectedOutput);
  });
});

describe('convertFormFieldsToElevatorRecord', () => {
  const mockLastMaintenanceDate = new Date('2024-05-20T10:00:00.000Z');
  const mockNextMaintenanceDate = new Date('2024-08-30T16:00:00.000Z');

  it('should convert form fields to a complete elevator record', () => {
    const mockInput = {
      buildingName: 'Skyline Plaza',
      capacity: 5000,
      elevatorLocation: 'Observation Deck',
      elevatorType: 'Scenic Elevator',
      id: 'test_id',
      lastMaintenanceDate: mockLastMaintenanceDate,
      nextMaintenanceDate: mockNextMaintenanceDate,
      status: 'Operational',
    };

    expect(convertFormFieldsToElevatorRecord(mockInput)).toEqual(mockInput);
  });

  it('should apply default values when fields are undefined', () => {
    const result = convertFormFieldsToElevatorRecord({
      elevatorType: null,
      capacity: null,
      buildingName: null,
      elevatorLocation: null,
      id: '',
      status: null,
      lastMaintenanceDate: undefined,
      nextMaintenanceDate: undefined,
    });

    expect(result.elevatorType).toBe('');
    expect(result.capacity).toBeNull();
    expect(result.buildingName).toBe('');
    expect(result.elevatorLocation).toBe('');
    expect(result.id).toBe('');
    expect(result.status).toBe('');
    expect(result.lastMaintenanceDate).toBeInstanceOf(Date);
    expect(result.nextMaintenanceDate).toBeInstanceOf(Date);
  });
});
