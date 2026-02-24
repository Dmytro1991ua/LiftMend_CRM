import { repairJobServicePrismaMock } from '@/mocks/gql/prismaMocks';
import { getBatchRepairJobChecklistItemsByJobId } from '@/pages/api/graphql/utils/batches/getBatchRepairJobChecklistItemsByJobId';

describe('getBatchRepairJobChecklistItemsByJobId', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch checklist items and group them by repairJobId', async () => {
    const keys = ['job-1', 'job-2'];

    const mockItems = [
      { id: 'c1', repairJobId: 'job-1', checkedAt: new Date() },
      { id: 'c2', repairJobId: 'job-2', checkedAt: new Date() },
      { id: 'c3', repairJobId: 'job-1', checkedAt: new Date() },
    ];

    (repairJobServicePrismaMock.repairJobChecklistItem.findMany as jest.Mock).mockResolvedValue(mockItems);

    const batchFn = getBatchRepairJobChecklistItemsByJobId(repairJobServicePrismaMock);

    const result = await batchFn(keys);

    expect(repairJobServicePrismaMock.repairJobChecklistItem.findMany).toHaveBeenCalledWith({
      where: {
        repairJobId: { in: keys },
      },
      orderBy: { checkedAt: 'asc' },
    });

    // Grouping must respect keys order
    expect(result).toEqual([
      [mockItems[0], mockItems[2]], // job-1
      [mockItems[1]], // job-2
    ]);
  });

  it('should return empty arrays for jobs without checklist items', async () => {
    const keys = ['non-existent-job'];

    (repairJobServicePrismaMock.repairJobChecklistItem.findMany as jest.Mock).mockResolvedValue([]);

    const batchFn = getBatchRepairJobChecklistItemsByJobId(repairJobServicePrismaMock);

    const result = await batchFn(keys);

    expect(result).toEqual([[]]);
  });
});
