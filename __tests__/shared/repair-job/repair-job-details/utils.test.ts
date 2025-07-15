import { mockRepairJob } from '@/mocks/repairJobTrackingMocks';
import { RepairJobFormValues } from '@/shared/repair-job/edit-repair-job-form/types';
import {
  convertFormFieldsToRepairJob,
  convertRepairJobToFormValues,
} from '@/shared/repair-job/repair-job-details/utils';
import { RepairJob } from '@/shared/types';

describe('convertRepairJobToFormValues', () => {
  it('should convert a repair job to form values', () => {
    const mockExpectedOutput = {
      buildingName: 'Crystal Ridge Towers',
      calendarEventId: '35c674d5-cf50-4153-b505-1e33696a1fdd',
      elevatorLocation: 'Lobby',
      elevatorType: 'Passenger Elevator',
      id: '1bcc2a00-5296-475f-af08-5cada100d509',
      jobDescription: 'asdasdasdasd',
      jobPriority: 'Low',
      jobType: 'Routine',
      scheduledDates: { from: '2025-01-18T22:00:00.000Z', to: '2025-01-20T21:59:59.999Z' },
      status: 'Scheduled',
      technicianName: 'Sophia Martinez',
    };

    expect(convertRepairJobToFormValues(mockRepairJob)).toEqual(mockExpectedOutput);
  });

  it('should handle null input gracefully', () => {
    const result = convertRepairJobToFormValues(null as unknown as RepairJob);

    const mockExpectedOutput = {
      buildingName: null,
      calendarEventId: null,
      elevatorLocation: null,
      elevatorType: null,
      id: '',
      jobDescription: '',
      jobPriority: null,
      jobType: null,
      scheduledDates: undefined,
      status: null,
      technicianName: null,
    };

    expect(result).toEqual(mockExpectedOutput);
  });
});

describe('convertFormFieldsToRepairJob', () => {
  const mockDate = new Date('2025-01-01T12:00:00Z');

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(mockDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should convert form fields to a complete repair job', () => {
    const mockInput: RepairJobFormValues = {
      buildingName: 'Ridge Towers',
      calendarEventId: 'test_calendar_id-1',
      elevatorLocation: 'Lobby',
      elevatorType: 'Passenger Elevator',
      id: 'test_id_1',
      jobDescription: 'asdasdasdasd',
      jobPriority: 'Low',
      jobType: 'Routine',
      scheduledDates: {
        from: new Date('2025-01-18T22:00:00.000Z'),
        to: new Date('2025-01-20T21:59:59.999Z'),
      },
      status: 'Scheduled',
      technicianName: 'Alex Smith',
    };

    const expectedOutput = {
      buildingName: 'Ridge Towers',
      calendarEventId: 'test_calendar_id-1',
      elevatorLocation: 'Lobby',
      elevatorType: 'Passenger Elevator',
      endDate: new Date('2025-01-20T21:59:59.999Z'),
      id: 'test_id_1',
      jobDetails: 'asdasdasdasd',
      jobPriority: 'Low',
      jobType: 'Routine',
      startDate: new Date('2025-01-18T22:00:00.000Z'),
      status: 'Scheduled',
      technicianName: 'Alex Smith',
    };

    expect(convertFormFieldsToRepairJob(mockInput)).toEqual(expectedOutput);
  });

  it('should apply default values when fields are undefined', () => {
    const result = convertFormFieldsToRepairJob({
      buildingName: null,
      calendarEventId: null,
      elevatorLocation: null,
      elevatorType: null,
      id: '',
      jobDescription: '',
      jobPriority: null,
      jobType: null,
      scheduledDates: undefined,
      status: null,
      technicianName: null,
    });

    expect(result).toEqual({
      buildingName: '',
      calendarEventId: null,
      elevatorLocation: '',
      elevatorType: '',
      endDate: mockDate,
      id: '',
      jobDetails: '',
      jobPriority: '',
      jobType: '',
      startDate: mockDate,
      status: '',
      technicianName: '',
    });
  });
});
