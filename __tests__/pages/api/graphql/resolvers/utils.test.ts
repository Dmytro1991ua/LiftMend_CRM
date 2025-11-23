import { mockCalendarEventId, mockRepairJob } from '@/mocks/repairJobTrackingMocks';
import {
  MAX_MAINTENANCE_DELAY_IMPACT,
  MILLISECONDS_IN_DAY,
  WORST_CASE_DAYS_SINCE_LAST_MAINTENANCE_THRESHOLD,
} from '@/pages/api/graphql/constants';
import {
  getCalculatedElevatorHealthScore,
  getDaysSinceLastMaintenance,
  getElevatorHealthImpact,
} from '@/pages/api/graphql/resolvers/utils';

describe('getElevatorHealthImpact', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 0 when value is 0', () => {
    expect(getElevatorHealthImpact(0, 10)).toBe(0);
  });

  it('should return the correct fraction of worst-case for impact value', () => {
    expect(getElevatorHealthImpact(5, 10)).toBe(0.5);
  });

  it('should return 1 when value exceeds worst-case threshold', () => {
    expect(getElevatorHealthImpact(20, 10)).toBe(1);
  });
});

describe('getDaysSinceLastMaintenance', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should calculate correct days for a past date', () => {
    const mockLastMaintenanceDate = new Date(Date.now() - 10 * MILLISECONDS_IN_DAY);

    const result = getDaysSinceLastMaintenance(mockLastMaintenanceDate);

    expect(result).toBe(10);
  });

  it('should return worst-case threshold when lastMaintenanceDate is null', () => {
    expect(getDaysSinceLastMaintenance(null)).toBe(WORST_CASE_DAYS_SINCE_LAST_MAINTENANCE_THRESHOLD);
  });
});

describe('getCalculatedElevatorHealthScore', () => {
  const mockLastMaintenanceDate = new Date();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 100 health score for no repair jobs and recent maintenance', () => {
    const result = getCalculatedElevatorHealthScore([], mockLastMaintenanceDate);

    expect(result).toBe(100);
  });

  it('should return 70 health score when lastMaintenanceDate is null and no repair jobs', () => {
    const result = getCalculatedElevatorHealthScore([], null);

    // null maintenance → maximum maintenance factor impact = 30
    expect(result).toBe(100 - MAX_MAINTENANCE_DELAY_IMPACT);
  });

  it('should calculate health score accounting for overdue and recent completed jobs with recent maintenance', () => {
    const mockRepairJobs = [
      {
        ...mockRepairJob,
        status: 'Completed',
        isOverdue: true,
        endDate: new Date(),
        startDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        actualEndDate: new Date(),
        calendarEventId: mockCalendarEventId,
      },
      {
        ...mockRepairJob,
        status: 'Completed',
        isOverdue: true,
        endDate: new Date(),
        startDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        actualEndDate: new Date(),
        calendarEventId: mockCalendarEventId,
      },
    ];

    const result = getCalculatedElevatorHealthScore(mockRepairJobs, mockLastMaintenanceDate);

    expect(result).toBe(92);
  });

  it('should ignore cancelled repair jobs', () => {
    const mockRepairJobs = [
      {
        ...mockRepairJob,
        status: 'Cancelled',
        isOverdue: true,
        endDate: new Date(),
        startDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        actualEndDate: new Date(),
        calendarEventId: mockCalendarEventId,
      },
    ];

    const result = getCalculatedElevatorHealthScore(mockRepairJobs, mockLastMaintenanceDate);

    expect(result).toBe(100);
  });

  it('should ignore completed jobs that occurred before last maintenance', () => {
    const mockLastMaintenanceDate = new Date(Date.now() - 10 * MILLISECONDS_IN_DAY);

    const mockRepairJobs = [
      {
        ...mockRepairJob,
        status: 'Completed',
        isOverdue: false,
        endDate: new Date(Date.now() - 20 * MILLISECONDS_IN_DAY),
        startDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        actualEndDate: new Date(),
        calendarEventId: mockCalendarEventId,
      },
      {
        ...mockRepairJob,
        status: 'Completed',
        isOverdue: false,
        endDate: new Date(),
        startDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        actualEndDate: new Date(),
        calendarEventId: mockCalendarEventId,
      },
    ];

    const result = getCalculatedElevatorHealthScore(mockRepairJobs, mockLastMaintenanceDate);

    expect(result).toBe(95);
  });

  it('should return 0 when all factors exceed worst-case thresholds with impacting job types', () => {
    const mockLastMaintenanceDate = new Date(Date.now() - 400 * MILLISECONDS_IN_DAY);

    const mockRepairJobs = Array.from({ length: 20 }).map(() => ({
      ...mockRepairJob,
      status: 'Completed',
      isOverdue: true,
      endDate: new Date(Date.now() - 10 * MILLISECONDS_IN_DAY),
      startDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      actualEndDate: new Date(),
      calendarEventId: mockCalendarEventId,
      jobType: 'Upgrade',
    }));

    const result = getCalculatedElevatorHealthScore(mockRepairJobs, mockLastMaintenanceDate);

    expect(result).toBe(0);
  });

  it('should return 30 when all factors exceed worst-case thresholds with non-impacting job types', () => {
    const mockLastMaintenanceDate = new Date(Date.now() - 400 * MILLISECONDS_IN_DAY);

    const mockRepairJobs = Array.from({ length: 20 }).map(() => ({
      ...mockRepairJob,
      status: 'Completed',
      isOverdue: true,
      endDate: new Date(Date.now() - 10 * MILLISECONDS_IN_DAY),
      startDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      actualEndDate: new Date(),
      calendarEventId: mockCalendarEventId,
      jobType: 'Routine',
    }));

    const result = getCalculatedElevatorHealthScore(mockRepairJobs, mockLastMaintenanceDate);

    expect(result).toBe(30);
  });
});
