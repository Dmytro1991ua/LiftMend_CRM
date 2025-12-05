import { repairJobServicePrismaMock } from '@/mocks/gql/prismaMocks';
import { DEFAULT_SORTING_OPTION } from '@/pages/api/graphql/dataSources/constants';
import { getBatchRepairJobsByElevator } from '@/pages/api/graphql/utils/batches/getBatchRepairJobsByElevator';

describe('getBatchRepairJobsByElevator', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all repair jobs and group them by buildingName and elevatorLocation', async () => {
    const mockKeys = ['elevator-1', 'elevator-2', 'elevator-3'];

    const mockJobs = [
      { id: '1', elevatorId: 'elevator-1', buildingName: 'BuildingA', elevatorLocation: 'Loc1', startDate: new Date() },
      { id: '2', elevatorId: 'elevator-2', buildingName: 'BuildingA', elevatorLocation: 'Loc2', startDate: new Date() },
      { id: '3', elevatorId: 'elevator-1', buildingName: 'BuildingA', elevatorLocation: 'Loc1', startDate: new Date() },
      { id: '4', elevatorId: 'elevator-3', buildingName: 'BuildingB', elevatorLocation: 'Loc9', startDate: new Date() },
    ];

    (repairJobServicePrismaMock.repairJob.findMany as jest.Mock).mockResolvedValue(mockJobs);

    const batchFn = getBatchRepairJobsByElevator(repairJobServicePrismaMock);

    const result = await batchFn(mockKeys);

    // Prisma was called correctly
    expect(repairJobServicePrismaMock.repairJob.findMany).toHaveBeenCalledWith({
      where: {
        elevatorId: { in: mockKeys },
      },
      orderBy: { startDate: DEFAULT_SORTING_OPTION },
    });

    // Result grouped according to keys order
    expect(result).toEqual([
      // "elevator-1"
      [mockJobs[0], mockJobs[2]],

      // "elevator-2"
      [mockJobs[1]],

      // "elevator-3"
      [mockJobs[3]],
    ]);
  });

  it('should return empty arrays when no jobs match a key', async () => {
    const mockKeys = ['non-existent-elevator'];

    (repairJobServicePrismaMock.repairJob.findMany as jest.Mock).mockResolvedValue([]);

    const batchFn = getBatchRepairJobsByElevator(repairJobServicePrismaMock);

    const result = await batchFn(mockKeys);

    expect(result).toEqual([[]]);
  });
});
