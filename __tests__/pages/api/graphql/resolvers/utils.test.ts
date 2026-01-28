import { RepairJob } from '@prisma/client';
import { subDays } from 'date-fns';

import {
  ElevatorRecurringFailureStatus,
  ElevatorSeverityLevel,
  TechnicianPerformanceMetrics,
} from '@/graphql/types/server/generated_types';
import {
  mockCalendarEventId,
  mockMastLiftRepairJob,
  mockPassengerElevatorRepairJob,
  mockRepairJob,
  mockShipElevatorRepairJpb,
} from '@/mocks/repairJobTrackingMocks';
import {
  ELEVATOR_REPAIR_FREQUENCY_THRESHOLDS,
  MAX_MAINTENANCE_DELAY_IMPACT,
  MAX_REPAIR_JOB_DURATION_IN_DAYS,
  MILLISECONDS_IN_DAY,
  WORST_CASE_DAYS_SINCE_LAST_MAINTENANCE_THRESHOLD,
} from '@/pages/api/graphql/constants';
import {
  clampScoreToPercentage,
  computeChangeLogFieldChanges,
  computeFieldChangesForKeys,
  getAverageRepairJobDurationInDays,
  getCalculateTechnicianPerformanceScore,
  getCalculatedElevatorHealthScore,
  getDaysSinceLastMaintenance,
  getDaysUntilInspection,
  getElevatorFailureRelatedJobsCount,
  getElevatorHealthImpact,
  getElevatorRepairFrequencyStatus,
  getInspectionStatus,
  getOnTimeCompletionRate,
  getPerformanceScoreFromRatio,
  getRecurringFailureStatus,
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

describe('createChangeLogField', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create field changes for meaningful updates', () => {
    const mockKeys = ['a', 'b'];
    const mockGetOld = (key: string) => (key === 'a' ? 1 : null);
    const mockGetNew = (key: string) => (key === 'a' ? 2 : 3);

    const result = computeFieldChangesForKeys({
      action: 'update',
      keys: mockKeys,
      getOld: mockGetOld,
      getNew: mockGetNew,
    });

    expect(result).toEqual([
      { field: 'a', oldValue: 1, newValue: 2, action: 'update' },
      { field: 'b', oldValue: null, newValue: 3, action: 'update' },
    ]);
  });

  it('should skip fields where both old and new values are null', () => {
    const mockKeys = ['a'];
    const mockGetOld = () => null;
    const mockGetNew = () => null;

    const result = computeFieldChangesForKeys({
      action: 'update',
      keys: mockKeys,
      getOld: mockGetOld,
      getNew: mockGetNew,
    });

    expect(result).toEqual([]);
  });

  it('should skip unchanged fields for updates', () => {
    const mockKeys = ['c'];
    const mockGetOld = () => 'same';
    const mockGetNew = () => 'same';

    const result = computeFieldChangesForKeys({
      action: 'update',
      keys: mockKeys,
      getOld: mockGetOld,
      getNew: mockGetNew,
    });

    expect(result).toEqual([]);
  });
});

describe('computeChangeLogFieldChanges', () => {
  afterEach(() => jest.clearAllMocks());

  it('should handle create action', () => {
    const mockOldValue = null;
    const mockNewValue = JSON.stringify({ a: 1, b: null });

    const result = computeChangeLogFieldChanges({ oldValue: mockOldValue, newValue: mockNewValue, action: 'create' });

    expect(result).toEqual([{ field: 'a', oldValue: null, newValue: 1, action: 'create' }]);
  });

  it('should handle update action', () => {
    const mockOldValue = JSON.stringify({ a: 1, b: 2 });
    const mockNewValue = JSON.stringify({ a: 1, b: 3, c: null });

    const result = computeChangeLogFieldChanges({ oldValue: mockOldValue, newValue: mockNewValue, action: 'update' });

    expect(result).toEqual([{ field: 'b', oldValue: 2, newValue: 3, action: 'update' }]);
  });

  it('should handle delete action', () => {
    const mockOldValue = JSON.stringify({ a: 1, b: null });
    const mockNewValue = null;

    const result = computeChangeLogFieldChanges({ oldValue: mockOldValue, newValue: mockNewValue, action: 'delete' });

    expect(result).toEqual([{ field: 'a', oldValue: 1, newValue: null, action: 'delete' }]);
  });

  it('should return empty array for unknown action', () => {
    const mockOldValue = '{"a":1}';
    const mockNewValue = '{"a":2}';

    const result = computeChangeLogFieldChanges({ oldValue: mockOldValue, newValue: mockNewValue, action: 'unknown' });

    expect(result).toEqual([]);
  });

  it('should skip null-only changes', () => {
    const mockOldValue = JSON.stringify({ a: null });
    const mockNewValue = JSON.stringify({ a: null });

    const result = computeChangeLogFieldChanges({ oldValue: mockOldValue, newValue: mockNewValue, action: 'update' });

    expect(result).toEqual([]);
  });
});

describe('getDaysUntilInspection', () => {
  const mockScenarios = [
    {
      name: 'should return 0 for inspection today',
      input: new Date(),
      expected: 0,
    },
    {
      name: 'should return positive days for future inspection',
      input: new Date(Date.now() + 5 * MILLISECONDS_IN_DAY),
      expected: 5,
    },
    {
      name: 'should return negative days for overdue inspection',
      input: new Date(Date.now() - 3 * MILLISECONDS_IN_DAY),
      expected: -3,
    },
  ];

  mockScenarios.forEach(({ name, input, expected }) => {
    it(name, () => {
      expect(getDaysUntilInspection(input)).toEqual(expected);
    });
  });
});

describe('getInspectionStatus', () => {
  const mockScenarios = [
    {
      name: 'should return OVERDUE config for past inspection',
      input: new Date(Date.now() - 2 * MILLISECONDS_IN_DAY),
      expected: {
        label: 'Inspection overdue',
        severity: ElevatorSeverityLevel.Error,
      },
    },
    {
      name: 'should return DUE_TODAY config for inspection today',
      input: new Date(),
      expected: {
        label: 'Inspection due today',
        severity: ElevatorSeverityLevel.Warning,
      },
    },
    {
      name: 'should return CRITICAL for for 1-7 days until inspection',
      input: new Date(Date.now() + 5 * MILLISECONDS_IN_DAY),
      expected: {
        label: 'Inspection due in 5 days',
        severity: ElevatorSeverityLevel.Warning,
      },
    },
    {
      name: 'should return UPCOMING config for 8-30 days until inspection',
      input: new Date(Date.now() + 20 * MILLISECONDS_IN_DAY),
      expected: {
        label: 'Inspection due within 30 days',
        severity: ElevatorSeverityLevel.Info,
      },
    },
    {
      name: 'should return UP_TO_DATE config for inspection more than 30 days away',
      input: new Date(Date.now() + 45 * MILLISECONDS_IN_DAY),
      expected: {
        label: 'Inspection up to date',
        severity: ElevatorSeverityLevel.Success,
      },
    },
  ];

  mockScenarios.forEach(({ name, input, expected }) => {
    it(name, () => {
      expect(getInspectionStatus(input)).toEqual(expected);
    });
  });
});

describe('getElevatorRepairFrequencyStatus', () => {
  const mockScenarios = [
    {
      name: 'should return SUCCESS config',
      input: 0,
      expected: {
        label: 'Stable',
        severity: ElevatorSeverityLevel.Success,
      },
    },
    {
      name: 'should return INFO config',
      input: ELEVATOR_REPAIR_FREQUENCY_THRESHOLDS.INFO,
      expected: {
        label: 'Minor',
        severity: ElevatorSeverityLevel.Info,
      },
    },
    {
      name: 'should return WARNING config',
      input: ELEVATOR_REPAIR_FREQUENCY_THRESHOLDS.INFO + 1,
      expected: {
        label: 'Occasional',
        severity: ElevatorSeverityLevel.Warning,
      },
    },
    {
      name: 'should return ERROR config',
      input: ELEVATOR_REPAIR_FREQUENCY_THRESHOLDS.WARNING + 1,
      expected: {
        label: 'Frequent',
        severity: ElevatorSeverityLevel.Error,
      },
    },
  ];

  mockScenarios.forEach(({ name, input, expected }) => {
    it(name, () => {
      const status = getElevatorRepairFrequencyStatus(input);

      expect(status.label).toBe(expected.label);
      expect(status.severity).toBe(expected.severity);
    });
  });
});

describe('getElevatorFailureRelatedJobsCount', () => {
  const today = new Date();

  const mockScenarios = [
    {
      name: 'should count only elevator failure-related jobs within last 30 days and not cancelled',
      input: [
        { ...mockRepairJob, jobType: 'Repair', status: 'Completed', createdAt: subDays(today, 5) },
        { ...mockRepairJob, jobType: 'Routine', status: 'Completed', createdAt: subDays(today, 10) },
        { ...mockRepairJob, jobType: 'Emergency', status: 'Cancelled', createdAt: subDays(today, 1) },
        { ...mockRepairJob, jobType: 'Maintenance', status: 'Completed', createdAt: subDays(today, 1) },
        { ...mockRepairJob, jobType: 'Repair', status: 'Completed', createdAt: subDays(today, 31) },
      ],
      expected: 2,
    },
    {
      name: 'should exclude jobs older than 30 days',
      input: [{ ...mockRepairJob, jobType: 'Repair', status: 'Completed', createdAt: subDays(today, 40) }],
      expected: 0,
    },
    {
      name: 'should exclude Cancelled jobs even if type is elevator failure-related and within 30 days',
      input: [{ ...mockRepairJob, jobType: 'Emergency', status: 'Cancelled', createdAt: subDays(today, 5) }],
      expected: 0,
    },
    {
      name: 'should return 0 if no jobs match failure-related types',
      input: [{ ...mockRepairJob, jobType: 'Inspection', status: 'Completed', createdAt: subDays(today, 5) }],
      expected: 0,
    },
  ];

  mockScenarios.forEach(({ name, input, expected }) => {
    it(name, () => {
      const mockCount = getElevatorFailureRelatedJobsCount(input as unknown as RepairJob[]);

      expect(mockCount).toBe(expected);
    });
  });
});

describe('getRecurringFailureStatus', () => {
  const mockBaseRepairJob = {
    ...mockRepairJob,
    id: 'job-1',
    jobType: 'Repair',
    status: 'Completed',
    actualEndDate: new Date(),
    createdAt: new Date('2026-01-01T10:00:00Z'),
    updatedAt: new Date('2026-01-01T10:00:00Z'),
    startDate: new Date('2026-01-01T08:00:00Z'),
    endDate: new Date('2026-01-01T09:00:00Z'),
  };

  const mockScenarios: Array<{
    name: string;
    repairJobs: RepairJob[];
    expected: ElevatorRecurringFailureStatus | null;
  }> = [
    {
      name: 'should return null when there are no repair jobs',
      repairJobs: [],
      expected: null,
    },
    {
      name: 'should return null when there is only one completed repair',
      repairJobs: [{ ...mockBaseRepairJob, actualEndDate: new Date('2026-01-27T10:00:00Z') }],
      expected: null,
    },
    {
      name: 'should return null when completed repair jobs are not failure-related',
      repairJobs: [
        { ...mockBaseRepairJob, jobType: 'Inspection', actualEndDate: new Date('2026-01-27T10:00:00Z') },
        { ...mockBaseRepairJob, jobType: 'Inspection', actualEndDate: new Date('2026-01-25T10:00:00Z') },
      ],
      expected: null,
    },
    {
      name: 'should return null when repair jobs are outside recurring threshold',
      repairJobs: [
        { ...mockBaseRepairJob, actualEndDate: new Date('2026-01-27T10:00:00Z') },
        { ...mockBaseRepairJob, actualEndDate: new Date('2025-10-01T10:00:00Z') },
      ],
      expected: null,
    },
    {
      name: 'should return null when only one completed failure-related repair has actualEndDate',
      repairJobs: [
        { ...mockBaseRepairJob, actualEndDate: new Date('2026-01-27T10:00:00Z') },
        { ...mockBaseRepairJob, status: 'Completed', jobType: 'Repair', actualEndDate: null },
        {
          ...mockBaseRepairJob,
          status: 'Cancelled',
          jobType: 'Repair',
          actualEndDate: new Date('2026-01-26T10:00:00Z'),
        },
      ],
      expected: null,
    },
    {
      name: 'should return recurring failure when two repairs are within threshold',
      repairJobs: [
        { ...mockBaseRepairJob, actualEndDate: new Date('2026-01-27T10:00:00Z') },
        { ...mockBaseRepairJob, actualEndDate: new Date('2026-01-25T10:00:00Z') },
      ],
      expected: {
        label: 'Recurring Failure',
        description:
          'This elevator failed again only 2 days after the last repair. This may indicate that the previous fix did not address the root cause.',
        severity: ElevatorSeverityLevel.Warning,
      },
    },
    {
      name: 'should return recurring failure when repairs happen on the same day',
      repairJobs: [
        { ...mockBaseRepairJob, actualEndDate: new Date('2026-01-27T10:00:00Z') },
        { ...mockBaseRepairJob, actualEndDate: new Date('2026-01-27T15:00:00Z') },
      ],
      expected: {
        label: 'Recurring Failure',
        description:
          'This elevator failed again on the same day as the last repair. This may indicate that the previous fix did not address the root cause.',
        severity: ElevatorSeverityLevel.Warning,
      },
    },
    {
      name: 'should return more than two repairs, pick two most recent',
      repairJobs: [
        { ...mockBaseRepairJob, actualEndDate: new Date('2026-01-10T10:00:00Z') },
        { ...mockBaseRepairJob, actualEndDate: new Date('2026-01-25T10:00:00Z') },
        { ...mockBaseRepairJob, actualEndDate: new Date('2026-01-27T10:00:00Z') },
      ],
      expected: {
        label: 'Recurring Failure',
        description:
          'This elevator failed again only 2 days after the last repair. This may indicate that the previous fix did not address the root cause.',
        severity: ElevatorSeverityLevel.Warning,
      },
    },
  ];

  mockScenarios.forEach(({ name, repairJobs: jobs, expected }) => {
    it(name, () => {
      const result = getRecurringFailureStatus(jobs);

      if (expected === null) {
        expect(result).toBeNull();
      } else {
        expect(result).toMatchObject(expected);
      }
    });
  });
});
