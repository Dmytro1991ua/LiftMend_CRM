import { RepairJobResolvers } from '@/graphql/types/server/generated_types';
import getResolverToTest, { TestResolver } from '@/mocks/gql/getResolverToTest';
import createDataSourcesMock from '@/mocks/gql/mockedDataSources';
import { repairJobServicePrismaMock } from '@/mocks/gql/prismaMocks';
import { mockRepairJobId, mockTechnicianId } from '@/mocks/repairJobTrackingMocks';
import { REPAIR_JOB_CHECKLIST_CONFIG } from '@/pages/api/graphql/resolvers/config';
import RepairJob from '@/pages/api/graphql/resolvers/RepairJob';
import { loadWithDataLoader } from '@/pages/api/graphql/utils/utils';

jest.mock('@/pages/api/graphql/utils/utils', () => ({
  ...jest.requireActual('@/pages/api/graphql/utils/utils'),
  loadWithDataLoader: jest.fn(),
}));

describe('RepairJob', () => {
  let mockDataSources: ReturnType<typeof createDataSourcesMock>;
  let checklistResolver: TestResolver<RepairJobResolvers, 'checklist'>;

  beforeEach(() => {
    mockDataSources = createDataSourcesMock(repairJobServicePrismaMock);

    checklistResolver = getResolverToTest<RepairJobResolvers, 'checklist'>(RepairJob, 'checklist', mockDataSources);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checklist', () => {
    const mockScenarios = [
      {
        name: 'should return Repair checklist config',
        jobType: 'Repair',
        expected: REPAIR_JOB_CHECKLIST_CONFIG.Repair,
      },
      {
        name: 'should return Maintenance checklist config',
        jobType: 'Maintenance',
        expected: REPAIR_JOB_CHECKLIST_CONFIG.Maintenance,
      },
      {
        name: 'should return Installation checklist config',
        jobType: 'Installation',
        expected: REPAIR_JOB_CHECKLIST_CONFIG.Installation,
      },
      {
        name: 'should return Inspection checklist config',
        jobType: 'Inspection',
        expected: REPAIR_JOB_CHECKLIST_CONFIG.Inspection,
      },
      {
        name: 'should return empty array for unknown jobType',
        jobType: 'UnknownJobType',
        expected: [],
      },
    ];

    mockScenarios.forEach(({ name, jobType, expected }) => {
      it(name, async () => {
        const result = await checklistResolver({
          id: mockRepairJobId,
          jobType,
          status: 'In Progress',
        });

        expect(loadWithDataLoader).not.toHaveBeenCalled();
        expect(result).toEqual(expected);
      });
    });

    it('should return fetched checklist from DB when status is Completed', async () => {
      const mockNowDate = new Date('2025-01-18T12:00:00.000Z');
      const mockChecklistItemsFromDb = [
        {
          id: 'check-1',
          repairJobId: mockRepairJobId,
          label: 'Test',
          checked: true,
          comment: 'Test comment',
          checkedAt: mockNowDate,
          checkedBy: mockTechnicianId,
        },
      ];

      (loadWithDataLoader as jest.Mock).mockResolvedValueOnce(mockChecklistItemsFromDb);

      const result = await checklistResolver({
        id: mockRepairJobId,
        jobType: 'Repair',
        status: 'Completed',
      });

      expect(loadWithDataLoader).toHaveBeenCalled();
      expect(result).toEqual(mockChecklistItemsFromDb);
    });
  });
});
