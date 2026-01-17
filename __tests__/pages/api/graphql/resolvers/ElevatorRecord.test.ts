import { ElevatorRecordResolvers, InspectionSeverity } from '@/graphql/types/server/generated_types';
import getResolverToTest, { TestResolver } from '@/mocks/gql/getResolverToTest';
import createDataSourcesMock from '@/mocks/gql/mockedDataSources';
import { elevatorRecordServicePrismaMock } from '@/mocks/gql/prismaMocks';
import { MILLISECONDS_IN_DAY } from '@/pages/api/graphql/constants';
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
        expected: { label: 'Inspection overdue', severity: InspectionSeverity.Error },
      },
      {
        name: 'should return DUE_TODAY config for inspection today',
        input: new Date(), // today
        expected: { label: 'Inspection due today', severity: InspectionSeverity.Warning },
      },
      {
        name: 'should return CRITICAL config for inspection in 3 days',
        input: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        expected: { label: 'Inspection due in 3 days', severity: InspectionSeverity.Warning },
      },
      {
        name: 'should return UPCOMING config for inspection in 20 days',
        input: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        expected: { label: 'Inspection due within 30 days', severity: InspectionSeverity.Info },
      },
      {
        name: 'should return UP_TO_DATE config for inspection in 60 days',
        input: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        expected: { label: 'Inspection up to date', severity: InspectionSeverity.Success },
      },
    ];

    mockScenarios.forEach(({ name, input, expected }) => {
      it(name, async () => {
        const result = await inspectionStatusResolver({ nextInspectionDate: input });

        expect(result).toEqual(expected);
      });
    });
  });
});
