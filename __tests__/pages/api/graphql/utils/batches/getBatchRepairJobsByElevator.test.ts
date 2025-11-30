import { repairJobServicePrismaMock } from '@/mocks/gql/prismaMocks';
import { DEFAULT_SORTING_OPTION } from '@/pages/api/graphql/dataSources/constants';
import { getBatchRepairJobsByElevator } from '@/pages/api/graphql/utils/batches/getBatchRepairJobsByElevator';

describe('getBatchRepairJobsByElevator', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all repair jobs and group them by buildingName and elevatorLocation', async () => {
    const mockKeys = ['BuildingA|Loc1', 'BuildingA|Loc2', 'BuildingB|Loc9'];

    const mockJobs = [
      { id: '1', buildingName: 'BuildingA', elevatorLocation: 'Loc1', startDate: new Date() },
      { id: '2', buildingName: 'BuildingA', elevatorLocation: 'Loc2', startDate: new Date() },
      { id: '3', buildingName: 'BuildingA', elevatorLocation: 'Loc1', startDate: new Date() },
      { id: '4', buildingName: 'BuildingB', elevatorLocation: 'Loc9', startDate: new Date() },
    ];

    (repairJobServicePrismaMock.repairJob.findMany as jest.Mock).mockResolvedValue(mockJobs);

    const batchFn = getBatchRepairJobsByElevator(repairJobServicePrismaMock);

    const result = await batchFn(mockKeys);

    // Prisma was called correctly
    expect(repairJobServicePrismaMock.repairJob.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { buildingName: 'BuildingA', elevatorLocation: 'Loc1' },
          { buildingName: 'BuildingA', elevatorLocation: 'Loc2' },
          { buildingName: 'BuildingB', elevatorLocation: 'Loc9' },
        ],
      },
      orderBy: { startDate: DEFAULT_SORTING_OPTION },
    });

    // Result grouped according to keys order
    expect(result).toEqual([
      // "BuildingA|Loc1"
      [mockJobs[0], mockJobs[2]],

      // "BuildingA|Loc2"
      [mockJobs[1]],

      // "BuildingB|Loc9"
      [mockJobs[3]],
    ]);
  });

  it('should return empty arrays when no jobs match a key', async () => {
    const mockKeys = ['test_building|test_elevator_location'];

    (repairJobServicePrismaMock.repairJob.findMany as jest.Mock).mockResolvedValue([]);

    const batchFn = getBatchRepairJobsByElevator(repairJobServicePrismaMock);

    const result = await batchFn(mockKeys);

    expect(result).toEqual([[]]);
  });
});
