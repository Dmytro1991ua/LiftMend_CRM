import { TechnicianRecordResolvers } from '@/graphql/types/server/generated_types';
import getResolverToTest, { TestResolver } from '@/mocks/gql/getResolverToTest';
import createDataSourcesMock from '@/mocks/gql/mockedDataSources';
import { repairJobServicePrismaMock } from '@/mocks/gql/prismaMocks';
import TechnicianRecord from '@/pages/api/graphql/resolvers/TechnicianRecord';
import { getTechnicianPerformanceMetrics } from '@/pages/api/graphql/resolvers/utils';
import { loadWithDataLoader } from '@/pages/api/graphql/utils/utils';

jest.mock('@/pages/api/graphql/utils/utils', () => ({
  ...jest.requireActual('@/pages/api/graphql/utils/utils'),
  loadWithDataLoader: jest.fn(),
}));

jest.mock('@/pages/api/graphql/resolvers/utils', () => ({
  ...jest.requireActual('@/pages/api/graphql/resolvers/utils'),
  getTechnicianPerformanceMetrics: jest.fn(),
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

      const mockPerformanceMetrics = {
        totalRepairJobs: 2,
        overdueRepairJobs: 1,
        averageDurationDays: 5,
        onTimeCompletionRate: 50,
      };

      (loadWithDataLoader as jest.Mock).mockResolvedValue(mockRepairJobs);
      (getTechnicianPerformanceMetrics as jest.Mock).mockReturnValue(mockPerformanceMetrics);

      const result = await performanceMetricsResolver({ name: mockTechnicianName });

      expect(loadWithDataLoader).toHaveBeenCalled();
      expect(getTechnicianPerformanceMetrics).toHaveBeenCalledWith(mockRepairJobs);
      expect(result).toEqual(mockPerformanceMetrics);
    });

    it('should return null metrics if no repair jobs are returned', async () => {
      (loadWithDataLoader as jest.Mock).mockResolvedValue([]);
      (getTechnicianPerformanceMetrics as jest.Mock).mockReturnValue({
        totalRepairJobs: 0,
        overdueRepairJobs: 0,
        averageDurationDays: 0,
        onTimeCompletionRate: 0,
      });

      const result = await performanceMetricsResolver({ name: mockTechnicianName });

      expect(loadWithDataLoader).toHaveBeenCalled();
      expect(getTechnicianPerformanceMetrics).toHaveBeenCalledWith([]);
      expect(result).toEqual({
        totalRepairJobs: 0,
        overdueRepairJobs: 0,
        averageDurationDays: 0,
        onTimeCompletionRate: 0,
      });
    });
  });
});
