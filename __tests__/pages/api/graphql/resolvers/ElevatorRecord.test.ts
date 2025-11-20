import { ElevatorRecordResolvers } from '@/graphql/types/server/generated_types';
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
  describe('healthScore', () => {
    let mockDataSources: ReturnType<typeof createDataSourcesMock>;

    let healthScoreResolver: TestResolver<ElevatorRecordResolvers, 'healthScore'>;

    const mockBuildingName = 'Building A';
    const mockElevatorLocation = 'Elevator 1';
    const mockLastMaintenanceDate = new Date();

    beforeEach(() => {
      mockDataSources = createDataSourcesMock(elevatorRecordServicePrismaMock);

      healthScoreResolver = getResolverToTest<ElevatorRecordResolvers, 'healthScore'>(
        ElevatorRecord,
        'healthScore',
        mockDataSources
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

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

      // 2 overdue jobs → 0.2 * 40 = 8
      // 2 completed jobs → 0.2 * 30 = 6
      // daysSinceMaintenance ≈ 0
      // score = 100 - (8 + 6 + 0) = 86
      expect(result).toBe(86);
    });

    it('should return 0 when all factors hit worst-case thresholds', async () => {
      const mockLastMaintenanceDate = new Date(Date.now() - 400 * MILLISECONDS_IN_DAY); // > 365 days

      (loadWithDataLoader as jest.Mock).mockResolvedValueOnce(
        Array.from({ length: 10 }).map(() => ({
          status: 'Completed',
          isOverdue: true,
          endDate: new Date(Date.now() - 10 * MILLISECONDS_IN_DAY),
        }))
      );

      const result = await healthScoreResolver({
        buildingName: mockBuildingName,
        elevatorLocation: mockElevatorLocation,
        lastMaintenanceDate: mockLastMaintenanceDate,
      });

      expect(result).toBe(0);
    });
  });
});
