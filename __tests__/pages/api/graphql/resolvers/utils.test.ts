import { RepairJob } from '@prisma/client';

import { TechnicianPerformanceMetrics } from '@/graphql/types/server/generated_types';
import {
  mockCalendarEventId,
  mockMastLiftRepairJob,
  mockPassengerElevatorRepairJob,
  mockRepairJob,
  mockShipElevatorRepairJpb,
} from '@/mocks/repairJobTrackingMocks';
import {
  MAX_MAINTENANCE_DELAY_IMPACT,
  MAX_REPAIR_JOB_DURATION_IN_DAYS,
  MILLISECONDS_IN_DAY,
  WORST_CASE_DAYS_SINCE_LAST_MAINTENANCE_THRESHOLD,
} from '@/pages/api/graphql/constants';
import {
  clampScoreToPercentage,
  getAverageRepairJobDurationInDays,
  getCalculateTechnicianPerformanceScore,
  getCalculatedElevatorHealthScore,
  getDaysSinceLastMaintenance,
  getElevatorHealthImpact,
  getOnTimeCompletionRate,
  getPerformanceScoreFromRatio,
  getRepairJobDurationInDays,
  getTechnicianPerformanceMetrics,
} from '@/pages/api/graphql/resolvers/utils';

describe('getRepairJobDurationInDays', () => {
  it('should correctly calculate the duration in days between two dates', () => {
    const mockStart = new Date('2024-01-01');
    const mockEnd = new Date('2024-01-04');

    const result = getRepairJobDurationInDays(mockStart, mockEnd);

    expect(result).toBe(3);
  });

  it('should return 0 if start and end date are the same', () => {
    const mockDate = new Date('2024-01-01');

    const result = getRepairJobDurationInDays(mockDate, mockDate);

    expect(result).toBe(0);
  });
});

describe('getAverageRepairJobDurationInDays', () => {
  it('should calculate the average duration and round to one decimal', () => {
    const mockTotalDurationDays = 22;
    const mockCompletedRepairJobs = 4;

    const result = getAverageRepairJobDurationInDays(mockTotalDurationDays, mockCompletedRepairJobs);

    expect(result).toBe(5.5);
  });

  it('should return 0 if there are no completed jobs', () => {
    const result = getAverageRepairJobDurationInDays(10, 0);

    expect(result).toBe(0);
  });
});

describe('getOnTimeCompletionRate', () => {
  it('should calculate the on-time completion rate as a whole percentage', () => {
    const result = getOnTimeCompletionRate(4, 5);

    expect(result).toBe(80);
  });

  it('should return 0 if there are no completed jobs', () => {
    const result = getOnTimeCompletionRate(0, 0);

    expect(result).toBe(0);
  });
});

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

describe('getPerformanceScoreFromRatio', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 100 for a ratio of 0', () => {
    expect(getPerformanceScoreFromRatio(0)).toBe(100);
  });

  it('should return 0 for a ratio of 1', () => {
    expect(getPerformanceScoreFromRatio(1)).toBe(0);
  });

  it('should return correct value for ratio between 0 and 1', () => {
    expect(getPerformanceScoreFromRatio(0.25)).toBe(75);
    expect(getPerformanceScoreFromRatio(0.5)).toBe(50);
    expect(getPerformanceScoreFromRatio(0.75)).toBe(25);
  });
});

describe('clampScoreToPercentage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should round and clamp values above 100', () => {
    expect(clampScoreToPercentage(120.7)).toBe(100);
  });

  it('should round and clamp values below 0', () => {
    expect(clampScoreToPercentage(-10.2)).toBe(0);
  });

  it('should round fractional scores within 0–100', () => {
    expect(clampScoreToPercentage(72.4)).toBe(72);
    expect(clampScoreToPercentage(72.6)).toBe(73);
  });
});

describe('getCalculateTechnicianPerformanceScore', () => {
  const mockTechnicianPerformanceMetrics: TechnicianPerformanceMetrics = {
    totalRepairJobs: 10,
    completedRepairJobs: 0,
    overdueRepairJobs: 2,
    averageDurationDays: 5,
    onTimeCompletionRate: 0.8,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return null when there are no repair jobs', () => {
    expect(
      getCalculateTechnicianPerformanceScore({ ...mockTechnicianPerformanceMetrics, totalRepairJobs: 0 })
    ).toBeNull();
  });

  it('should calculate a score within 0–100', () => {
    const result = getCalculateTechnicianPerformanceScore(mockTechnicianPerformanceMetrics);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(100);
  });

  it('should handle perfect performance', () => {
    const result = getCalculateTechnicianPerformanceScore({
      totalRepairJobs: 10,
      overdueRepairJobs: 0,
      averageDurationDays: 0,
      onTimeCompletionRate: 100,
      completedRepairJobs: 2,
    });

    expect(result).toBe(100);
  });

  it('should handle worst possible performance', () => {
    const result = getCalculateTechnicianPerformanceScore({
      totalRepairJobs: 10,
      overdueRepairJobs: 10,
      averageDurationDays: MAX_REPAIR_JOB_DURATION_IN_DAYS,
      onTimeCompletionRate: 0,
      completedRepairJobs: 0,
    })!;

    expect(result).toBe(0);
  });
});

describe('getTechnicianPerformanceMetrics', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockTechnician = 'Chloe Carter';
  const mockRepairJobs = [
    mockPassengerElevatorRepairJob.node,
    mockMastLiftRepairJob.node,
    mockShipElevatorRepairJpb.node,
  ].map((job) => ({
    ...job,
    technicianName: mockTechnician,
    startDate: new Date(job.startDate),
    endDate: new Date(job.endDate),
    actualEndDate: job.actualEndDate ? new Date(job.actualEndDate) : undefined,
  })) as RepairJob[];

  it('should calculate metrics correctly', () => {
    const result = getTechnicianPerformanceMetrics(mockRepairJobs);

    expect(result).toEqual({
      activeRepairJobs: 2,
      averageDurationDays: 5.6,
      completedRepairJobs: 1,
      onTimeCompletionRate: 0,
      overdueRepairJobs: 1,
      totalRepairJobs: 3,
      performanceScore: 38,
    });
  });

  it('should handle empty array', () => {
    const result = getTechnicianPerformanceMetrics([]);

    expect(result).toEqual({
      activeRepairJobs: 0,
      averageDurationDays: 0,
      completedRepairJobs: 0,
      onTimeCompletionRate: 0,
      overdueRepairJobs: 0,
      performanceScore: null,
      totalRepairJobs: 0,
    });
  });
});
