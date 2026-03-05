import { technicianRecordPrismaMock } from '@/mocks/gql/prismaMocks';
import { DEFAULT_SORTING_OPTION } from '@/pages/api/graphql/dataSources/constants';
import { getTechnicianEmploymentHistoryByTechnicianId } from '@/pages/api/graphql/utils/batches';
describe('getTechnicianEmploymentHistoryByTechnicianId', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch technician employment history and group by technicianId', async () => {
    const keys = ['tech-1', 'tech-2', 'tech-3'];

    const mockHistory = [
      { id: 'h1', technicianId: 'tech-1', createdAt: new Date() },
      { id: 'h2', technicianId: 'tech-2', createdAt: new Date() },
      { id: 'h3', technicianId: 'tech-1', createdAt: new Date() },
      { id: 'h4', technicianId: 'tech-3', createdAt: new Date() },
    ];

    (technicianRecordPrismaMock.technicianEmploymentHistory.findMany as jest.Mock).mockResolvedValue(mockHistory);

    const batchFn = getTechnicianEmploymentHistoryByTechnicianId(technicianRecordPrismaMock);

    const result = await batchFn(keys);

    expect(technicianRecordPrismaMock.technicianEmploymentHistory.findMany).toHaveBeenCalledWith({
      where: {
        technicianId: { in: keys },
      },
      orderBy: { createdAt: DEFAULT_SORTING_OPTION },
    });

    // Must preserve key order
    expect(result).toEqual([
      [mockHistory[0], mockHistory[2]], // tech-1
      [mockHistory[1]], // tech-2
      [mockHistory[3]], // tech-3
    ]);
  });

  it('should return empty arrays when no history exists', async () => {
    const keys = ['missing-tech'];

    (technicianRecordPrismaMock.technicianEmploymentHistory.findMany as jest.Mock).mockResolvedValue([]);

    const batchFn = getTechnicianEmploymentHistoryByTechnicianId(technicianRecordPrismaMock);

    const result = await batchFn(keys);

    expect(result).toEqual([[]]);
  });
});
