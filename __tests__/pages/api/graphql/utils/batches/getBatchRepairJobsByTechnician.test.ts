import { PrismaClient } from '@prisma/client';

import { DEFAULT_SORTING_OPTION } from '@/pages/api/graphql/dataSources/constants';
import { getBatchRepairJobsByTechnician } from '@/pages/api/graphql/utils/batches';

describe('getBatchRepairJobsByTechnician', () => {
  const prismaMock = {
    repairJob: {
      findMany: jest.fn(),
    },
  } as unknown as PrismaClient;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all repair jobs and group them by technicianName', async () => {
    const mockKeys = ['tech-1', 'tech-2', 'tech-3'];

    const mockJobs = [
      {
        id: '1',
        technicianId: 'tech-1',
        technicianName: 'Alice',
        buildingName: 'B1',
        elevatorLocation: 'L1',
        startDate: new Date(),
        endDate: new Date(),
        jobType: 'Routine',
        jobDetails: 'Test',
        elevatorType: 'Passenger',
        calendarEventId: null,
        createdAt: new Date(),
        updatedAt: null,
      },
      {
        id: '2',
        technicianId: 'tech-2',
        technicianName: 'Bob',
        buildingName: 'B2',
        elevatorLocation: 'L2',
        startDate: new Date(),
        endDate: new Date(),
        jobType: 'Routine',
        jobDetails: 'Test',
        elevatorType: 'Freight',
        calendarEventId: null,
        createdAt: new Date(),
        updatedAt: null,
      },
      {
        id: '3',
        technicianId: 'tech-1',
        technicianName: 'Alice',
        buildingName: 'B1',
        elevatorLocation: 'L3',
        startDate: new Date(),
        endDate: new Date(),
        jobType: 'Routine',
        jobDetails: 'Test',
        elevatorType: 'Passenger',
        calendarEventId: null,
        createdAt: new Date(),
        updatedAt: null,
      },
      {
        id: '4',
        technicianId: 'tech-3',
        technicianName: 'Charlie',
        buildingName: 'B3',
        elevatorLocation: 'L4',
        startDate: new Date(),
        endDate: new Date(),
        jobType: 'Routine',
        jobDetails: 'Test',
        elevatorType: 'Freight',
        calendarEventId: null,
        createdAt: new Date(),
        updatedAt: null,
      },
    ];

    (prismaMock.repairJob.findMany as jest.Mock).mockResolvedValue(mockJobs);

    const batchFn = getBatchRepairJobsByTechnician(prismaMock);

    const result = await batchFn(mockKeys);

    // Prisma was called correctly
    expect(prismaMock.repairJob.findMany).toHaveBeenCalledWith({
      where: {
        technicianId: { in: mockKeys },
      },
      orderBy: { startDate: DEFAULT_SORTING_OPTION },
    });

    // Result grouped according to keys order
    expect(result).toEqual([
      // "Alice"
      [mockJobs[0], mockJobs[2]],

      // "Bob"
      [mockJobs[1]],

      // "Charlie"
      [mockJobs[3]],
    ]);
  });

  it('should return empty arrays when no jobs match a key', async () => {
    const mockKeys = ['NonexistentTechnician'];

    (prismaMock.repairJob.findMany as jest.Mock).mockResolvedValue([]);

    const batchFn = getBatchRepairJobsByTechnician(prismaMock);

    const result = await batchFn(mockKeys);

    expect(result).toEqual([[]]);
  });
});
