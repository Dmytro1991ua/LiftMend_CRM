import { subDays } from 'date-fns';

import { ElevatorRecordResolvers, ElevatorSeverityLevel } from '@/graphql/types/server/generated_types';
import getResolverToTest, { TestResolver } from '@/mocks/gql/getResolverToTest';
import createDataSourcesMock from '@/mocks/gql/mockedDataSources';
import { elevatorRecordServicePrismaMock } from '@/mocks/gql/prismaMocks';
import { mockElevatorId, mockRepairJob } from '@/mocks/repairJobTrackingMocks';
import { ELEVATOR_REPAIR_FREQUENCY_THRESHOLDS, MILLISECONDS_IN_DAY } from '@/pages/api/graphql/constants';
import ElevatorRecord from '@/pages/api/graphql/resolvers/ElevatorRecord';
import { loadWithDataLoader } from '@/pages/api/graphql/utils/utils';

jest.mock('@/pages/api/graphql/utils/utils', () => ({
  ...jest.requireActual('@/pages/api/graphql/utils/utils'),
  loadWithDataLoader: jest.fn().mockResolvedValue([]),
}));

describe('ElevatorRecord', () => {
  let mockDataSources: ReturnType<typeof createDataSourcesMock>;

  let healthScoreResolver: TestResolver<ElevatorRecordResolvers, 'healthScore'>;
  let inspectionStatusResolver: TestResolver<ElevatorRecordResolvers, 'inspectionStatus'>;
  let repairFrequencyStatusResolver: TestResolver<ElevatorRecordResolvers, 'repairFrequencyStatus'>;

  beforeEach(() => {
    mockDataSources = createDataSourcesMock(elevatorRecordServicePrismaMock);

    healthScoreResolver = getResolverToTest<ElevatorRecordResolvers, 'healthScore'>(
      ElevatorRecord,
      'healthScore',
      mockDataSources
    );
    inspectionStatusResolver = getResolverToTest<ElevatorRecordResolvers, 'inspectionStatus'>(
      ElevatorRecord,
      'inspectionStatus',
      mockDataSources
    );
    repairFrequencyStatusResolver = getResolverToTest<ElevatorRecordResolvers, 'repairFrequencyStatus'>(
      ElevatorRecord,
      'repairFrequencyStatus',
      mockDataSources
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('healthScore', () => {
    const mockBuildingName = 'Building A';
    const mockElevatorLocation = 'Elevator 1';
    const mockLastMaintenanceDate = new Date();

    it('should return 100 health score when no repair jobs and recent maintenance', async () => {
      const result = await healthScoreResolver({
        buildingName: mockBuildingName,
        elevatorLocation: mockElevatorLocation,
        lastMaintenanceDate: mockLastMaintenanceDate,
      });

      expect(result).toBe(100);
    });

    it('should return 70 health score when no repair jobs and last maintenance older than worse-case threshold', async () => {
      const mockLastMaintenanceDate = new Date(Date.now() - 366 * MILLISECONDS_IN_DAY); // > 365 days

      const result = await healthScoreResolver({
        buildingName: mockBuildingName,
        elevatorLocation: mockElevatorLocation,
        lastMaintenanceDate: mockLastMaintenanceDate,
      });

      expect(result).toBe(70);
    });

    it('should return 70 when lastMaintenanceDate is null (worst-case maintenance factor)', async () => {
      const result = await healthScoreResolver({
        buildingName: mockBuildingName,
        elevatorLocation: mockElevatorLocation,
        lastMaintenanceDate: null,
      });

      expect(result).toBe(70);
    });

    it('should calculate health score correctly for 2 completed overdue jobs with recent maintenance', async () => {
      (loadWithDataLoader as jest.Mock).mockResolvedValueOnce([
        { status: 'Completed', isOverdue: true, endDate: new Date() },
        { status: 'Completed', isOverdue: true, endDate: new Date() },
      ]);

      const result = await healthScoreResolver({
        buildingName: mockBuildingName,
        elevatorLocation: mockElevatorLocation,
        lastMaintenanceDate: mockLastMaintenanceDate,
      });

      expect(result).toBe(92);
    });

    it('should return 0 when all factors hit worst-case thresholds with impacting job types', async () => {
      const mockLastMaintenanceDate = new Date(Date.now() - 400 * MILLISECONDS_IN_DAY); // > 365 days

      (loadWithDataLoader as jest.Mock).mockResolvedValueOnce(
        Array.from({ length: 10 }).map(() => ({
          status: 'Completed',
          isOverdue: true,
          endDate: new Date(Date.now() - 10 * MILLISECONDS_IN_DAY),
          jobType: 'Upgrade',
        }))
      );

      const result = await healthScoreResolver({
        buildingName: mockBuildingName,
        elevatorLocation: mockElevatorLocation,
        lastMaintenanceDate: mockLastMaintenanceDate,
      });

      expect(result).toBe(0);
    });

    it('should return 30 when all factors hit worst-case thresholds with non-impacting job types', async () => {
      const mockLastMaintenanceDate = new Date(Date.now() - 400 * MILLISECONDS_IN_DAY); // > 365 days

      (loadWithDataLoader as jest.Mock).mockResolvedValueOnce(
        Array.from({ length: 10 }).map(() => ({
          status: 'Completed',
          isOverdue: true,
          endDate: new Date(Date.now() - 10 * MILLISECONDS_IN_DAY),
          jobType: 'Routine',
        }))
      );

      const result = await healthScoreResolver({
        buildingName: mockBuildingName,
        elevatorLocation: mockElevatorLocation,
        lastMaintenanceDate: mockLastMaintenanceDate,
      });

      expect(result).toBe(30);
    });
  });

  describe('inspectionStatus', () => {
    const mockScenarios = [
      {
        name: 'should return null when nextInspectionDate is undefined',
        input: undefined,
        expected: null,
      },
      {
        name: 'should return null when nextInspectionDate is null',
        input: null,
        expected: null,
      },
      {
        name: 'should return OVERDUE config for past inspection',
        input: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        expected: { label: 'Inspection overdue', severity: ElevatorSeverityLevel.Error },
      },
      {
        name: 'should return DUE_TODAY config for inspection today',
        input: new Date(), // today
        expected: { label: 'Inspection due today', severity: ElevatorSeverityLevel.Warning },
      },
      {
        name: 'should return CRITICAL config for inspection in 3 days',
        input: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        expected: { label: 'Inspection due in 3 days', severity: ElevatorSeverityLevel.Warning },
      },
      {
        name: 'should return UPCOMING config for inspection in 20 days',
        input: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        expected: { label: 'Inspection due within 30 days', severity: ElevatorSeverityLevel.Info },
      },
      {
        name: 'should return UP_TO_DATE config for inspection in 60 days',
        input: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        expected: { label: 'Inspection up to date', severity: ElevatorSeverityLevel.Success },
      },
    ];

    mockScenarios.forEach(({ name, input, expected }) => {
      it(name, async () => {
        const result = await inspectionStatusResolver({ nextInspectionDate: input });

        expect(result).toEqual(expected);
      });
    });
  });

  describe('repairFrequencyStatus', () => {
    const today = new Date();

    const createRepairJobMock = (count: number) =>
      Array.from({ length: count }).map(() => ({
        ...mockRepairJob,
        jobType: 'Repair',
        status: 'Completed',
        createdAt: subDays(today, 5),
      }));

    const mockScenarios = [
      {
        name: 'should return SUCCESS config',
        repairJobs: [],
        expected: {
          label: 'Stable',
          description: 'No significant repairs in the last 30 days — elevator is stable.',
          severity: ElevatorSeverityLevel.Success,
        },
      },
      {
        name: 'should return INFO config',
        repairJobs: createRepairJobMock(ELEVATOR_REPAIR_FREQUENCY_THRESHOLDS.INFO),
        expected: {
          label: 'Minor',
          description: 'This elevator has been repaired 2 times in the last 30 days — minor issues observed.',
          severity: ElevatorSeverityLevel.Info,
        },
      },
      {
        name: 'should return WARNING config',
        repairJobs: createRepairJobMock(ELEVATOR_REPAIR_FREQUENCY_THRESHOLDS.WARNING),
        expected: {
          label: 'Occasional',
          description:
            'This elevator has been repaired 4 times in the last 30 days — occasional failures observed, monitor closely.',
          severity: ElevatorSeverityLevel.Warning,
        },
      },
      {
        name: 'should return ERROR config',
        repairJobs: createRepairJobMock(ELEVATOR_REPAIR_FREQUENCY_THRESHOLDS.WARNING + 1),
        expected: {
          label: 'Frequent',
          description:
            'This elevator has been repaired 5 times in the last 30 days — repeated failures detected, consider immediate maintenance.',
          severity: ElevatorSeverityLevel.Error,
        },
      },
      {
        name: 'should ignore Cancelled repair jobs',
        repairJobs: [
          {
            ...mockRepairJob,
            jobType: 'Repair',
            status: 'Cancelled',
            createdAt: subDays(today, 5),
          },
        ],
        expected: {
          label: 'Stable',
          description: expect.any(String),
          severity: ElevatorSeverityLevel.Success,
        },
      },
      {
        name: 'should ignore repair jobs older than 30 days',
        repairJobs: [
          {
            ...mockRepairJob,
            jobType: 'Repair',
            status: 'Completed',
            createdAt: subDays(today, 40),
          },
        ],
        expected: {
          label: 'Stable',
          description: expect.any(String),
          severity: ElevatorSeverityLevel.Success,
        },
      },
    ];

    mockScenarios.forEach(({ name, repairJobs, expected }) => {
      it(name, async () => {
        (loadWithDataLoader as jest.Mock).mockResolvedValueOnce(repairJobs);

        const result = await repairFrequencyStatusResolver({ id: mockElevatorId });

        expect(result).toEqual(expected);
      });
    });
  });
});
