import { UpdateRepairJobInput } from '@/graphql/types/client/generated_types';
import {
  CreateRepairJobInput,
  OrderOption,
  QueryGetElevatorMaintenanceHistoryArgs,
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
  mockTechnicianId,
} from '@/mocks/repairJobTrackingMocks';
import { DEFAULT_RECENT_JOBS_COUNT, DEFAULT_SORTING_OPTION } from '@/pages/api/graphql/dataSources/constants';
import RepairJobService from '@/pages/api/graphql/dataSources/RepairJobService';
import {
  createRepairJobFilterOptions,
  createRepairJobSortOptions,
  fetchFormDropdownData,
  getSortedFormDropdownData,
  makeConnectionObject,
} from '@/pages/api/graphql/utils/utils';

jest.mock('@/pages/api/graphql/utils/utils', () => ({
  ...jest.requireActual('@/pages/api/graphql/utils/utils'),
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

      (fetchFormDropdownData as jest.Mock).mockImplementation(async (_cb, label) => {
        if (label === 'repair job statutes') {
          return ['Scheduled', 'In Progress', 'Completed'];
        }

        return [`mocked dropdown for ${label}`];
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should fetch and return all dropdown form data', async () => {
      const result = await repairJobService.getRepairJobScheduleData();

      expect(fetchFormDropdownData).toHaveBeenCalledTimes(8);
      expect(result).toEqual({
        buildingNames: ['mocked dropdown for building names'],
        elevatorLocations: ['mocked dropdown for elevator locations'],
        elevatorTypes: ['mocked dropdown for elevator types'],
        priorities: ['mocked dropdown for repair job priorities'],
        repairJobTypes: ['mocked dropdown for repair job types'],
        statuses: ['Scheduled', 'In Progress'],
        technicianNames: ['mocked dropdown for technician names'],
        technicianSkills: ['mocked dropdown for technician skills'],
      });
    });
  });

  describe('getElevatorDetailsByBuildingName', () => {
    const mockedElevatorRecords = [
      mockElevatorRecord,
      {
        ...mockElevatorRecord,
        elevatorType: 'Freight Elevator',
        elevatorLocation: 'Warehouse',
      },
    ];

    it('should return all elevator details when no selectedElevatorType is provided', async () => {
      (repairJobServicePrismaMock.elevatorRecord.findMany as jest.Mock).mockResolvedValue(mockedElevatorRecords);

      const result = await repairJobService.getElevatorDetailsByBuildingName(mockElevatorRecord.buildingName);

      expect(repairJobServicePrismaMock.elevatorRecord.findMany).toHaveBeenCalledWith({
        select: { elevatorLocation: true, elevatorType: true },
        where: { buildingName: mockElevatorRecord.buildingName },
      });

      expect(result).toEqual({
        elevatorTypes: ['Scenic Elevator', 'Freight Elevator'],
        elevatorLocations: ['Observation Deck', 'Warehouse'],
      });
    });

    it('should return only locations for the selected elevator type', async () => {
      (repairJobServicePrismaMock.elevatorRecord.findMany as jest.Mock).mockResolvedValue(mockedElevatorRecords);

      const selectedElevatorType = 'Scenic Elevator';
      const result = await repairJobService.getElevatorDetailsByBuildingName(
        mockElevatorRecord.buildingName,
        selectedElevatorType
      );

      expect(result).toEqual({
        elevatorTypes: ['Scenic Elevator', 'Freight Elevator'],
        elevatorLocations: ['Observation Deck'],
      });
    });

    it('should return empty locations if selected type does not exist', async () => {
      (repairJobServicePrismaMock.elevatorRecord.findMany as jest.Mock).mockResolvedValue(mockedElevatorRecords);

      const selectedElevatorType = 'Nonexistent Elevator';
      const result = await repairJobService.getElevatorDetailsByBuildingName(
        mockElevatorRecord.buildingName,
        selectedElevatorType
      );

      expect(result).toEqual({
        elevatorTypes: ['Scenic Elevator', 'Freight Elevator'],
        elevatorLocations: [],
      });
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
      technicianId: 'test-technician-id-1',
    };

    it('should mark job as overdue if endDate is before mockDate and status is Scheduled', async () => {
      const mockExpectedOutput = {
        id: 'test-repair-job-1',
        ...mockNewRepairJob,
        status: 'Scheduled',
        isOverdue: true,
      };

      (repairJobServicePrismaMock.repairJob.create as jest.Mock).mockResolvedValue(mockExpectedOutput);

      const result = await repairJobService.createRepairJob(
        mockNewRepairJob,
        'test-elevator-id-1',
        'test-technician-id-1'
      );

      expect(repairJobServicePrismaMock.repairJob.create).toHaveBeenCalledWith({
        data: {
          ...mockNewRepairJob,
          isOverdue: true,
          elevatorId: 'test-elevator-id-1',
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

      const result = await repairJobService.createRepairJob(
        mockedNewRepairJob,
        'test-elevator-id-1',
        'test-technician-id-1'
      );

      expect(repairJobServicePrismaMock.repairJob.create).toHaveBeenCalledWith({
        data: {
          ...mockedNewRepairJob,
          isOverdue: false,
          elevatorId: 'test-elevator-id-1',
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

  describe('createChecklist', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    const mockChecklistItem = {
      label: 'Test Label',
      checked: true,
      comment: 'Test comment',
    };

    it('should throw an error if any checklist item is unchecked', async () => {
      const mockChecklist = [{ ...mockChecklistItem }, { ...mockChecklistItem, checked: false }];

      await expect(
        repairJobService.createChecklist({
          prisma: repairJobServicePrismaMock,
          repairJobId: mockRepairJobId,
          checklist: mockChecklist,
          checkedBy: mockTechnicianId,
        })
      ).rejects.toThrow('Checklist is incomplete');

      expect(repairJobServicePrismaMock.repairJobChecklistItem.createMany).not.toHaveBeenCalled();
    });

    it('should call create checklist with correct data if all items are checked', async () => {
      const mockChecklist = [
        { ...mockChecklistItem, comment: 'Good' },
        { ...mockChecklistItem, label: 'Item 2', comment: 'Checked' },
      ];

      await repairJobService.createChecklist({
        prisma: repairJobServicePrismaMock,
        repairJobId: mockRepairJobId,
        checklist: mockChecklist,
        checkedBy: mockTechnicianId,
      });

      expect(repairJobServicePrismaMock.repairJobChecklistItem.createMany).toHaveBeenCalledWith({
        data: mockChecklist.map((item) => ({
          repairJobId: mockRepairJobId,
          label: item.label,
          checked: item.checked,
          comment: item.comment,
          checkedAt: mockNowDate,
          checkedBy: mockTechnicianId,
        })),
      });
    });
  });

  describe('getChecklist', () => {
    const mockChecklistItem = {
      label: 'Test Label',
      checked: true,
      comment: 'Test comment',
    };

    const mockChecklist = [
      { ...mockChecklistItem, checkedAt: mockNowDate },
      { ...mockChecklistItem, checkedAt: mockNowDate },
    ];

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return checklist', async () => {
      repairJobServicePrismaMock.repairJobChecklistItem.findMany = jest.fn().mockResolvedValue(mockChecklist);

      const result = await repairJobService.getChecklist(repairJobServicePrismaMock, mockRepairJobId);

      expect(repairJobServicePrismaMock.repairJobChecklistItem.findMany).toHaveBeenCalledWith({
        where: { repairJobId: mockRepairJobId },
        orderBy: { checkedAt: 'asc' },
      });

      expect(result).toEqual(mockChecklist);
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
      checklist: [],
    };

    const mockChecklist = [
      {
        label: 'Test',
        checked: true,
        comment: 'Test comment',
      },
    ];

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

    beforeEach(() => {
      jest.spyOn(repairJobService, 'createChecklist').mockResolvedValue(undefined);
      jest.spyOn(repairJobService, 'getChecklist').mockResolvedValue(mockChecklistItemsFromDb);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

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

    it('should create checklist items when job is completed with checklist', async () => {
      const mockInput = {
        id: mockRepairJobId,
        status: 'Completed',
        checklist: mockChecklist,
      };

      (repairJobServicePrismaMock.repairJob.update as jest.Mock).mockResolvedValue({
        ...mockRepairJob,
        status: 'Completed',
        isOverdue: false,
      });

      const result = await repairJobService.updateRepairJob(mockInput);

      expect(repairJobService.createChecklist).toHaveBeenCalledWith({
        prisma: repairJobServicePrismaMock,
        repairJobId: mockRepairJobId,
        checklist: mockChecklist,
        checkedBy: mockTechnicianId,
      });

      expect(repairJobService.getChecklist).toHaveBeenCalledWith(repairJobServicePrismaMock, mockRepairJobId);

      expect(result.checklist).toEqual(mockChecklistItemsFromDb);
    });

    it('should NOT create checklist if status is not Completed', async () => {
      const mockInput = {
        id: mockRepairJobId,
        status: 'Scheduled',
        checklist: mockChecklist,
      };

      (repairJobServicePrismaMock.repairJob.update as jest.Mock).mockResolvedValue({
        ...mockRepairJob,
        status: 'Scheduled',
        isOverdue: false,
      });

      const result = await repairJobService.updateRepairJob(mockInput);

      expect(repairJobService.createChecklist).not.toHaveBeenCalled();
      expect(repairJobService.getChecklist).not.toHaveBeenCalled();
      expect(result.checklist).toEqual([]);
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
    const mockElevatorId = 'test_elevator_id';
    const mockArgs = {
      paginationOptions: { offset: 5, limit: 10 },
      elevatorId: mockElevatorId,
    } as unknown as QueryGetElevatorMaintenanceHistoryArgs;

    const mockRepairJobRecords = [
      {
        ...mockRepairJob,
        id: 'test-id-2',
        elevatorType: 'Glass Elevator',
        elevatorId: mockElevatorId,
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

      const result = await repairJobService.elevatorMaintenanceHistory(mockArgs);

      expect(repairJobServicePrismaMock.repairJob.findMany).toHaveBeenCalledWith({
        where: {
          elevatorId: mockElevatorId,
        },
        orderBy: { startDate: DEFAULT_SORTING_OPTION },
        skip: 5,
        take: 10,
      });

      expect(repairJobServicePrismaMock.repairJob.count).toHaveBeenCalledWith({
        where: {
          elevatorId: mockElevatorId,
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
