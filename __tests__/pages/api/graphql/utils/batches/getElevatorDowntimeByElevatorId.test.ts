import { elevatorRecordServicePrismaMock } from '@/mocks/gql/prismaMocks';
import { DEFAULT_SORTING_OPTION } from '@/pages/api/graphql/dataSources/constants';
import { getElevatorDowntimeByElevatorId } from '@/pages/api/graphql/utils/batches/getElevatorDowntimeByElevatorId';

describe('getElevatorDowntimeByElevatorId', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch elevator downtimes and group them by elevatorRecordId', async () => {
    const keys = ['elevator-1', 'elevator-2', 'elevator-3'];

    const mockDowntimes = [
      { id: 'd1', elevatorRecordId: 'elevator-1', startedAt: new Date() },
      { id: 'd2', elevatorRecordId: 'elevator-2', startedAt: new Date() },
      { id: 'd3', elevatorRecordId: 'elevator-1', startedAt: new Date() },
      { id: 'd4', elevatorRecordId: 'elevator-3', startedAt: new Date() },
    ];

    (elevatorRecordServicePrismaMock.elevatorDowntime.findMany as jest.Mock).mockResolvedValue(mockDowntimes);

    const batchFn = getElevatorDowntimeByElevatorId(elevatorRecordServicePrismaMock);

    const result = await batchFn(keys);

    expect(elevatorRecordServicePrismaMock.elevatorDowntime.findMany).toHaveBeenCalledWith({
      where: {
        elevatorRecordId: { in: keys },
      },
      orderBy: { startedAt: DEFAULT_SORTING_OPTION },
    });

    // Grouping must follow keys order
    expect(result).toEqual([
      [mockDowntimes[0], mockDowntimes[2]], // elevator-1
      [mockDowntimes[1]], // elevator-2
      [mockDowntimes[3]], // elevator-3
    ]);
  });

  it('should return empty arrays when no elevator downtimes exist', async () => {
    const keys = ['missing-elevator'];

    (elevatorRecordServicePrismaMock.elevatorDowntime.findMany as jest.Mock).mockResolvedValue([]);

    const batchFn = getElevatorDowntimeByElevatorId(elevatorRecordServicePrismaMock);

    const result = await batchFn(keys);

    expect(result).toEqual([[]]);
  });
});
