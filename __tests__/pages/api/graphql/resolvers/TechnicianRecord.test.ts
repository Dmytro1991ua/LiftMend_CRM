import { TechnicianRecordResolvers } from '@/graphql/types/server/generated_types';
import getResolverToTest, { TestResolver } from '@/mocks/gql/getResolverToTest';
import createDataSourcesMock from '@/mocks/gql/mockedDataSources';
import { repairJobServicePrismaMock } from '@/mocks/gql/prismaMocks';
import TechnicianRecord from '@/pages/api/graphql/resolvers/TechnicianRecord';
import { loadWithDataLoader } from '@/pages/api/graphql/utils/utils';

jest.mock('@/pages/api/graphql/utils/utils', () => ({
  ...jest.requireActual('@/pages/api/graphql/utils/utils'),
  loadWithDataLoader: jest.fn(),
}));

describe('TechnicianRecord', () => {
  describe('performanceMetrics', () => {
    let mockDataSources: ReturnType<typeof createDataSourcesMock>;
    let performanceMetricsResolver: TestResolver<TechnicianRecordResolvers, 'performanceMetrics'>;

    const mockTechnicianName = 'Alice';

    beforeEach(() => {
      mockDataSources = createDataSourcesMock(repairJobServicePrismaMock);

      performanceMetricsResolver = getResolverToTest<TechnicianRecordResolvers, 'performanceMetrics'>(
        TechnicianRecord,
        'performanceMetrics',
        mockDataSources
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call loadWithDataLoader and return performance metrics', async () => {
      const mockRepairJobs = [
        {
          id: '1',
          technicianName: 'Alice',
          status: 'Completed',
          isOverdue: false,
          startDate: new Date(),
          endDate: new Date(),
          jobType: 'Routine',
          buildingName: 'B1',
          elevatorLocation: 'L1',
          elevatorType: 'Passenger',
          calendarEventId: null,
          createdAt: new Date(),
          updatedAt: null,
        },
        {
          id: '2',
          technicianName: 'Alice',
          status: 'Completed',
          isOverdue: true,
          startDate: new Date(),
          endDate: new Date(),
          jobType: 'Upgrade',
          buildingName: 'B2',
          elevatorLocation: 'L2',
          elevatorType: 'Freight',
          calendarEventId: null,
          createdAt: new Date(),
          updatedAt: null,
        },
      ];

      (loadWithDataLoader as jest.Mock).mockResolvedValue(mockRepairJobs);

      const result = await performanceMetricsResolver({ name: mockTechnicianName });

      expect(loadWithDataLoader).toHaveBeenCalled();
      expect(result).toEqual({
        activeRepairJobs: 0,
        averageDurationDays: 0,
        completedRepairJobs: 2,
        onTimeCompletionRate: 0,
        overdueRepairJobs: 1,
        performanceScore: 40,
        totalRepairJobs: 2,
      });
    });

    it('should return null metrics if no repair jobs are returned', async () => {
      (loadWithDataLoader as jest.Mock).mockResolvedValue([]);

      const result = await performanceMetricsResolver({ name: mockTechnicianName });

      expect(loadWithDataLoader).toHaveBeenCalled();
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
});
