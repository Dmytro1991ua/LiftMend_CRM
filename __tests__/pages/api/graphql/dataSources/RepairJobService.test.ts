import { UpdateRepairJobInput } from '@/graphql/types/client/generated_types';
import {
  CreateRepairJobInput,
  OrderOption,
  QueryGetElevatorMentainanceHistoryArgs,
  RepairJob,
  RepairJobSortField,
} from '@/graphql/types/server/generated_types';
import { mockElevatorRecord } from '@/mocks/elevatorManagementMocks';
import { repairJobServicePrismaMock } from '@/mocks/gql/prismaMocks';
import { mockCalendarEventId } from '@/mocks/repairJobScheduling';
import {
  mockMastLiftRepairJob,
  mockPassengerElevatorRepairJob,
  mockRepairJob,
  mockRepairJobId,
  mockShipElevatorRepairJpb,
} from '@/mocks/repairJobTrackingMocks';
import { DEFAULT_RECENT_JOBS_COUNT, DEFAULT_SORTING_OPTION } from '@/pages/api/graphql/dataSources/constants';
import RepairJobService from '@/pages/api/graphql/dataSources/RepairJobService';
import {
  createRepairJobFilterOptions,
  createRepairJobSortOptions,
  fetchFormDropdownData,
  getSortedFormDropdownData,
  makeConnectionObject,
} from '@/pages/api/graphql/utils';

jest.mock('@/pages/api/graphql/utils', () => ({
  ...jest.requireActual('@/pages/api/graphql/utils'),
  createRepairJobFilterOptions: jest.fn(),
  createRepairJobSortOptions: jest.fn(),
  makeConnectionObject: jest.fn(),
  fetchFormDropdownData: jest.fn(),
  getSortedFormDropdownData: jest.fn(),
}));

describe('RepairJobService', () => {
  const mockRepairJobs = [
    mockPassengerElevatorRepairJob.node,
    mockMastLiftRepairJob.node,
    mockShipElevatorRepairJpb.node,
  ];
  const mockNowDate = new Date('2025-01-18T12:00:00.000Z');
  const mockActualEndDate = '2025-01-18T18:00:00.000Z';

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(mockNowDate);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  const repairJobService = new RepairJobService(repairJobServicePrismaMock);

  describe('getRepairJobs', () => {
    const mockArgs = {
      paginationOptions: { offset: 5, limit: 10 },
      sortOptions: { field: 'ACTUAL_END_DATE' as RepairJobSortField, order: 'ASC' as OrderOption },
      filterOptions: { status: ['In Progress'], startDate: '2025-01-01', endDate: '2025-06-30' },
    };
    const mockFilters = { status: 'In Progress' };
    const mockOrderBy = { createdAt: 'desc' };
    const mockTotalItems = 2;
    const mockConnection = {
      edges: [],
      pageInfo: {},
      totalCount: mockTotalItems,
    };
    const mockExpectedWhere = {
      ...mockFilters,
      createdAt: {
        gte: new Date('2025-01-01'),
        lte: new Date('2025-06-30'),
      },
    };

    beforeEach(() => {
      (createRepairJobFilterOptions as jest.Mock).mockReturnValue(mockFilters);
      (createRepairJobSortOptions as jest.Mock).mockReturnValue(mockOrderBy);
      (makeConnectionObject as jest.Mock).mockReturnValue(mockConnection);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should fetch repair jobs with correct prisma calls and return connection object', async () => {
      (repairJobServicePrismaMock.repairJob.findMany as jest.Mock).mockResolvedValue(mockRepairJobs);
      (repairJobServicePrismaMock.repairJob.count as jest.Mock).mockResolvedValue(mockTotalItems);

      const result = await repairJobService.getRepairJobs(mockArgs);

      expect(repairJobServicePrismaMock.repairJob.findMany).toHaveBeenCalledWith({
        where: mockExpectedWhere,
        orderBy: mockOrderBy,
        skip: 5,
        take: 10,
      });

      expect(repairJobServicePrismaMock.repairJob.count).toHaveBeenCalledWith({
        where: mockFilters,
      });

      expect(makeConnectionObject).toHaveBeenCalledWith({
        items: mockRepairJobs,
        totalItems: mockTotalItems,
        paginationOptions: mockArgs.paginationOptions,
        getCursor: expect.any(Function),
      });

      const getCursorFn = (makeConnectionObject as jest.Mock).mock.calls[0][0].getCursor;
      expect(getCursorFn({ id: 'abc-123' } as RepairJob)).toBe('abc-123');

      expect(result).toEqual(mockConnection);
    });
  });

  describe('findRepairJobById', () => {
    it('should return repair job by id', async () => {
      (repairJobServicePrismaMock.repairJob.findUnique as jest.Mock).mockResolvedValue(mockRepairJob);

      const result = await repairJobService.findRepairJobById(mockRepairJobId);

      expect(repairJobServicePrismaMock.repairJob.findUnique).toHaveBeenCalledWith({
        where: { id: mockRepairJobId },
      });
      expect(result).toEqual(mockRepairJob);
    });
  });

  describe('getRepairJobScheduleData', () => {
    beforeEach(() => {
      (getSortedFormDropdownData as jest.Mock).mockImplementation((model) =>
        Promise.resolve([`sorted data for ${model}`])
      );

      (fetchFormDropdownData as jest.Mock).mockImplementation(async (cb, label) => {
        return `mocked dropdown for ${label}`;
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should fetch and return all dropdown form data', async () => {
      const result = await repairJobService.getRepairJobScheduleData();

      expect(fetchFormDropdownData).toHaveBeenCalledTimes(8);
      expect(result).toEqual({
        buildingNames: 'mocked dropdown for building names',
        elevatorLocations: 'mocked dropdown for elevator locations',
        elevatorTypes: 'mocked dropdown for elevator types',
        priorities: 'mocked dropdown for repair job priorities',
        repairJobTypes: 'mocked dropdown for repair job types',
        statuses: 'mocked dropdown for repair job statutes',
        technicianNames: 'mocked dropdown for technician names',
        technicianSkills: 'mocked dropdown for technician skills',
      });
    });
  });

  describe('getElevatorDetailsByBuildingName', () => {
    it('should return elevator details by building name', async () => {
      (repairJobServicePrismaMock.elevatorRecord.findMany as jest.Mock).mockResolvedValue([mockElevatorRecord]);

      const result = await repairJobService.getElevatorDetailsByBuildingName(mockElevatorRecord.buildingName);

      expect(repairJobServicePrismaMock.elevatorRecord.findMany).toHaveBeenCalledWith({
        select: { elevatorLocation: true, elevatorType: true },
        where: { buildingName: mockElevatorRecord.buildingName },
      });

      expect(result).toEqual({ elevatorLocations: ['Observation Deck'], elevatorTypes: ['Scenic Elevator'] });
    });
  });

  describe('getElevatorRecordsMetrics', () => {
    const mockRepairJobs = {
      edges: [
        { ...mockMastLiftRepairJob },
        { ...mockPassengerElevatorRepairJob },
        { ...mockShipElevatorRepairJpb },
        {
          node: { ...mockRepairJob, status: 'Completed', actualEndDate: mockActualEndDate },
          cursor: mockRepairJobId,
        },
      ],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: '',
        endCursor: '',
      },
      total: 3,
    };
    const mocksStartDate = '2025-01-18T22:00:00.000Z';
    const mockEndDate = '2025-01-26T21:59:59.999Z';

    beforeEach(() => {
      jest.spyOn(repairJobService, 'getRepairJobs').mockResolvedValue(mockRepairJobs);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should calculate repair jobs metrics correctly', async () => {
      const result = await repairJobService.getRepairJobsMetrics(mocksStartDate, mockEndDate);

      expect(result).toEqual({
        cancelledRepairJobs: 0,
        completedRepairJobs: 2,
        completedRepairJobsToday: 1,
        complianceJobs: 0,
        consultationJobs: 1,
        emergencyJobs: 0,
        highPriorityRepairJobs: 0,
        inProgressRepairJobs: 0,
        inspectionJobs: 0,
        installationJobs: 0,
        lowPriorityRepairJobs: 2,
        mediumPriorityRepairJobs: 2,
        mentainanceJobs: 0,
        modernizationJobs: 0,
        onHoldRepairJobs: 0,
        ongoingRepairJobs: 1,
        overdueRepairJobs: 1,
        repairJobs: 0,
        routineJobs: 2,
        scheduledRepairJobs: 1,
        totalRepairJobs: 4,
        upgradeJobs: 1,
      });
    });
  });

  describe('createRepairJob', () => {
    const mockNewRepairJob: CreateRepairJobInput = {
      jobType: 'Routine',
      jobDetails: 'asdasdasdasd',
      jobPriority: 'Low',
      elevatorType: 'Passenger Elevator',
      buildingName: 'Crystal Ridge Towers',
      elevatorLocation: 'Lobby',
      technicianName: 'Sophia Martinez',
      startDate: new Date('2025-01-10T00:00:00.000Z'),
      endDate: new Date('2025-01-15T00:00:00.000Z'),
    };

    it('should mark job as overdue if endDate is before mockDate and status is Scheduled', async () => {
      const mockExpectedOutput = {
        id: 'test-repair-job-1',
        ...mockNewRepairJob,
        status: 'Scheduled',
        isOverdue: true,
      };

      (repairJobServicePrismaMock.repairJob.create as jest.Mock).mockResolvedValue(mockExpectedOutput);

      const result = await repairJobService.createRepairJob(mockNewRepairJob);

      expect(repairJobServicePrismaMock.repairJob.create).toHaveBeenCalledWith({
        data: {
          ...mockNewRepairJob,
          isOverdue: true,
        },
      });
      expect(result).toEqual(mockExpectedOutput);
    });

    it('should not mark job as overdue if endDate is after mockDate and status is Scheduled', async () => {
      const mockedNewRepairJob: CreateRepairJobInput = {
        ...mockNewRepairJob,
        startDate: mockNowDate,
        endDate: new Date('2025-01-20T00:00:00.000Z'),
      };

      const mockExpectedOutput = {
        id: 'job-124',
        ...mockedNewRepairJob,
        status: 'Scheduled',
        isOverdue: false,
      };

      (repairJobServicePrismaMock.repairJob.create as jest.Mock).mockResolvedValue(mockExpectedOutput);

      const result = await repairJobService.createRepairJob(mockedNewRepairJob);

      expect(repairJobServicePrismaMock.repairJob.create).toHaveBeenCalledWith({
        data: {
          ...mockedNewRepairJob,
          isOverdue: false,
        },
      });
      expect(result).toEqual(mockExpectedOutput);
    });
  });

  describe('updateRepairJobWithCalendarEventId', () => {
    it('should update repairJob with calendarEventId', async () => {
      (repairJobServicePrismaMock.repairJob.update as jest.Mock).mockResolvedValue(mockRepairJob);

      const result = await repairJobService.updateRepairJobWithCalendarEventId(mockRepairJobId, mockCalendarEventId);

      expect(repairJobServicePrismaMock.repairJob.update).toHaveBeenCalledWith({
        where: { id: mockRepairJobId },
        data: { calendarEventId: mockCalendarEventId },
      });
      expect(result).toEqual(mockRepairJob);
    });
  });

  describe('updateRepairJob', () => {
    const mockUpdatedJobDetails = 'Updated jobDetails';

    const mockInput: UpdateRepairJobInput = {
      id: mockRepairJobId,
      jobDetails: mockUpdatedJobDetails,
    };

    const mockUpdatedRepairJob = {
      ...mockRepairJob,
      jobDetails: mockUpdatedJobDetails,
    };

    it('should update repair job with only jobDetails and compute isOverdue as false', async () => {
      (repairJobServicePrismaMock.repairJob.update as jest.Mock).mockResolvedValue(mockUpdatedRepairJob);

      const result = await repairJobService.updateRepairJob(mockInput);

      expect(repairJobServicePrismaMock.repairJob.update).toHaveBeenCalledWith({
        data: { jobDetails: mockUpdatedJobDetails, isOverdue: false },
        where: { id: mockRepairJobId },
      });
      expect(result).toEqual(mockUpdatedRepairJob);
    });

    it('should set actualEndDate if status is Completed', async () => {
      const mockInput = { id: mockRepairJobId, status: 'Completed' };

      (repairJobServicePrismaMock.repairJob.findUnique as jest.Mock).mockResolvedValue(mockRepairJob);
      (repairJobServicePrismaMock.repairJob.update as jest.Mock).mockResolvedValue({
        ...mockRepairJob,
        status: 'Completed',
        actualEndDate: mockNowDate,
        isOverdue: false,
      });

      const result = await repairJobService.updateRepairJob(mockInput);

      expect(repairJobServicePrismaMock.repairJob.update).toHaveBeenCalledWith({
        where: { id: mockRepairJobId },
        data: {
          status: 'Completed',
          actualEndDate: mockNowDate,
          isOverdue: false,
        },
      });

      expect(result.status).toBe('Completed');
      expect(result.actualEndDate).toEqual(mockNowDate);
    });

    it('should mark job as overdue if endDate is before now and status is Scheduled', async () => {
      const mockPastEndDate = new Date('2024-01-01T00:00:00.000Z');
      const mockInput = { id: mockRepairJobId, endDate: mockPastEndDate, status: 'Scheduled' };

      (repairJobServicePrismaMock.repairJob.findUnique as jest.Mock).mockResolvedValue(mockRepairJob);
      (repairJobServicePrismaMock.repairJob.update as jest.Mock).mockResolvedValue({
        ...mockRepairJob,
        ...mockInput,
        isOverdue: true,
      });

      const result = await repairJobService.updateRepairJob(mockInput);

      expect(repairJobServicePrismaMock.repairJob.update).toHaveBeenCalledWith({
        where: { id: mockRepairJobId },
        data: {
          endDate: mockPastEndDate,
          status: 'Scheduled',
          isOverdue: true,
        },
      });

      expect(result.isOverdue).toBe(true);
    });

    it('should omit null fields in update', async () => {
      const mockInput = { id: mockRepairJobId, jobDetails: null };

      (repairJobServicePrismaMock.repairJob.findUnique as jest.Mock).mockResolvedValue(mockRepairJob);
      (repairJobServicePrismaMock.repairJob.update as jest.Mock).mockResolvedValue(mockRepairJob);

      await repairJobService.updateRepairJob(mockInput);

      expect(repairJobServicePrismaMock.repairJob.update).toHaveBeenCalledWith({
        where: { id: mockRepairJobId },
        data: {
          isOverdue: false,
        },
      });
    });

    it('should fallback to existing status and endDate if not provided in input', async () => {
      const mockInput = { id: mockRepairJobId };
      const mockExistingJob = {
        ...mockRepairJob,
        status: 'Scheduled',
        endDate: new Date('2025-12-12T00:00:00.000Z'),
      };

      (repairJobServicePrismaMock.repairJob.findUnique as jest.Mock).mockResolvedValue(mockExistingJob);
      (repairJobServicePrismaMock.repairJob.update as jest.Mock).mockResolvedValue({
        ...mockExistingJob,
        isOverdue: false,
      });

      await repairJobService.updateRepairJob(mockInput);

      expect(repairJobServicePrismaMock.repairJob.update).toHaveBeenCalledWith({
        where: { id: mockRepairJobId },
        data: {
          isOverdue: false,
        },
      });
    });
  });

  describe('deleteRepairJob', () => {
    it('should delete repair job by id', async () => {
      (repairJobServicePrismaMock.repairJob.delete as jest.Mock).mockResolvedValue(mockRepairJob);

      const result = await repairJobService.deleteRepairJob(mockRepairJobId);

      expect(repairJobServicePrismaMock.repairJob.delete).toHaveBeenCalledWith({
        where: { id: mockRepairJobId },
      });
      expect(result).toEqual(mockRepairJob);
    });
  });

  describe('recentRepairJobs', () => {
    it('should fetch recent repair jobs', async () => {
      (repairJobServicePrismaMock.repairJob.findMany as jest.Mock).mockResolvedValue(mockRepairJobs);

      const result = await repairJobService.recentRepairJobs(DEFAULT_RECENT_JOBS_COUNT);

      expect(repairJobServicePrismaMock.repairJob.findMany).toHaveBeenCalledWith({
        orderBy: { startDate: DEFAULT_SORTING_OPTION },
        take: DEFAULT_RECENT_JOBS_COUNT,
      });
      expect(result).toEqual(mockRepairJobs);
    });
  });

  describe('elevatorMentainanceHistory', () => {
    const mockArgs = {
      paginationOptions: { offset: 5, limit: 10 },
      buildingName: 'Silverhill Apartments',
      elevatorLocation: 'Penthouse',
    } as unknown as QueryGetElevatorMentainanceHistoryArgs;

    const mockRepairJobRecords = [
      {
        ...mockRepairJob,
        id: 'test-id-2',
        elevatorType: 'Glass Elevator',
        buildingName: 'Silverhill Apartments',
        elevatorLocation: 'Penthouse',
      },
    ];
    const mockTotalItems = 2;
    const mockConnection = {
      edges: [],
      pageInfo: {},
      totalCount: mockTotalItems,
    };

    beforeEach(() => {
      (makeConnectionObject as jest.Mock).mockReturnValue(mockConnection);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should fetch repair jobs records for elevator mentainance history with correct prisma calls and return connection object by building name and elevator location', async () => {
      (repairJobServicePrismaMock.repairJob.findMany as jest.Mock).mockResolvedValue(mockRepairJobRecords);
      (repairJobServicePrismaMock.repairJob.count as jest.Mock).mockResolvedValue(mockTotalItems);

      const result = await repairJobService.elevatorMentainanceHistory(mockArgs);

      expect(repairJobServicePrismaMock.repairJob.findMany).toHaveBeenCalledWith({
        where: {
          buildingName: 'Silverhill Apartments',
          elevatorLocation: 'Penthouse',
        },
        orderBy: { startDate: DEFAULT_SORTING_OPTION },
        skip: 5,
        take: 10,
      });

      expect(repairJobServicePrismaMock.repairJob.count).toHaveBeenCalledWith({
        where: {
          buildingName: 'Silverhill Apartments',
          elevatorLocation: 'Penthouse',
        },
      });

      expect(makeConnectionObject).toHaveBeenCalledWith({
        items: mockRepairJobRecords,
        totalItems: mockTotalItems,
        paginationOptions: mockArgs.paginationOptions,
        getCursor: expect.any(Function),
      });

      const getCursorFn = (makeConnectionObject as jest.Mock).mock.calls[0][0].getCursor;
      expect(getCursorFn({ id: 'abc-123' } as RepairJob)).toBe('abc-123');

      expect(result).toEqual(mockConnection);
    });
  });
});
