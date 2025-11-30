import { getBatchEntities } from '@/pages/api/graphql/utils/batches';

type MockEntity = {
  id: string;
  group: string;
};

describe('getBatchEntities', () => {
  const mockEntities: MockEntity[] = [
    { id: '1', group: 'A' },
    { id: '2', group: 'B' },
    { id: '3', group: 'A' },
    { id: '4', group: 'C' },
  ];
  const mockFetchFn = jest.fn(async (keys: readonly string[]) => {
    // Return all items that match any key
    return mockEntities.filter((item) => keys.includes(item.group));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const keyExtractor = (key: string) => ({ group: key });
  const groupByFn = (item: MockEntity) => ({ group: item.group });

  const batchEntities = getBatchEntities<MockEntity, string, { group: string }>({
    fetchFn: mockFetchFn,
    keyExtractor,
    groupByFn,
  });

  it('should group items correctly by key', async () => {
    const result = await batchEntities(['A', 'B', 'C']);

    expect(result).toEqual([
      [
        { id: '1', group: 'A' },
        { id: '3', group: 'A' },
      ],
      [{ id: '2', group: 'B' }],
      [{ id: '4', group: 'C' }],
    ]);
  });

  it('should return empty array for keys with no matching items', async () => {
    const result = await batchEntities(['A', 'D']); // 'D' has no items
    expect(result).toEqual([
      [
        { id: '1', group: 'A' },
        { id: '3', group: 'A' },
      ],
      [],
    ]);
  });

  it('should preserve the order of input keys', async () => {
    const result = await batchEntities(['C', 'A', 'B']);

    expect(result.map((arr) => arr.map((i) => i.id))).toEqual([['4'], ['1', '3'], ['2']]);
  });

  it('should return empty array if no keys are provided', async () => {
    const result = await batchEntities([]);

    expect(result).toEqual([]);
  });

  it('should call fetchFn with all keys', async () => {
    await batchEntities(['A', 'B']);

    expect(mockFetchFn).toHaveBeenCalledWith(['A', 'B']);
  });
});
