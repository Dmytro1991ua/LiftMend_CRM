import { addMonths } from 'date-fns';

import { QueryGetElevatorRecordsArgs, UpdateElevatorRecordInput } from '@/graphql/types/server/generated_types';
import { mockElevatorRecord, mockElevatorRecordId } from '@/mocks/elevatorManagementMocks';
import { elevatorRecordServicePrismaMock } from '@/mocks/gql/prismaMocks';
import { mockRepairJob } from '@/mocks/repairJobScheduling';
import ElevatorService from '@/pages/api/graphql/dataSources/ElevatorService';
import {
  createElevatorRecordFilterOptions,
  createElevatorRecordSortOptions,
  fetchFormDropdownData,
  getSortedFormDropdownData,
  makeConnectionObject,
} from '@/pages/api/graphql/utils/utils';
import { DEFAULT_ELEVATOR_SCHEDULED_INTERVAL_MONTHS } from '@/shared/constants';

jest.mock('@/pages/api/graphql/utils/utils', () => ({
  createElevatorRecordFilterOptions: jest.fn(),
  createElevatorRecordSortOptions: jest.fn(),
  makeConnectionObject: jest.fn(),
  fetchFormDropdownData: jest.fn(),
  getSortedFormDropdownData: jest.fn(),
}));

describe('ElevatorService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const elevatorService = new ElevatorService(elevatorRecordServicePrismaMock);

  describe('getElevatorRecords', () => {
    const mockArgs = {
      paginationOptions: { offset: 5, limit: 10 },
      sortOptions: { field: 'createdAt', order: 'desc' },
      filterOptions: { status: 'active' },
    } as unknown as QueryGetElevatorRecordsArgs;

    const mockFilters = { status: 'active' };
    const mockOrderBy = { createdAt: 'desc' };
    const mockElevatorRecords = [
      mockElevatorRecord,
      {
        ...mockElevatorRecord,
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
      (createElevatorRecordFilterOptions as jest.Mock).mockReturnValue(mockFilters);
      (createElevatorRecordSortOptions as jest.Mock).mockReturnValue(mockOrderBy);
      (makeConnectionObject as jest.Mock).mockReturnValue(mockConnection);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should fetch elevator records with correct prisma calls and return connection object', async () => {
      (elevatorRecordServicePrismaMock.elevatorRecord.findMany as jest.Mock).mockResolvedValue(mockElevatorRecords);
      (elevatorRecordServicePrismaMock.elevatorRecord.count as jest.Mock).mockResolvedValue(mockTotalItems);

      const result = await elevatorService.getElevatorRecords(mockArgs);

      expect(elevatorRecordServicePrismaMock.elevatorRecord.findMany).toHaveBeenCalledWith({
        where: mockFilters,
        orderBy: mockOrderBy,
        skip: 5,
        take: 10,
      });

      expect(elevatorRecordServicePrismaMock.elevatorRecord.count).toHaveBeenCalledWith({
        where: mockFilters,
      });

      expect(makeConnectionObject).toHaveBeenCalledWith({
        items: mockElevatorRecords,
        totalItems: mockTotalItems,
        paginationOptions: mockArgs.paginationOptions,
        getCursor: expect.any(Function),
      });

      expect(result).toEqual(mockConnection);
    });
  });

  describe('findElevatorRecordById', () => {
    it('should return elevator record by id', async () => {
      (elevatorRecordServicePrismaMock.elevatorRecord.findUnique as jest.Mock).mockResolvedValue(mockElevatorRecord);

      const result = await elevatorService.findElevatorRecordById(mockElevatorRecordId);

      expect(elevatorRecordServicePrismaMock.elevatorRecord.findUnique).toHaveBeenCalledWith({
        where: { id: mockElevatorRecordId },
      });
      expect(result).toEqual(mockElevatorRecord);
    });

    it('should throw an error if id is undefined', async () => {
      await expect(elevatorService.findElevatorRecordById(undefined)).rejects.toThrow('RepairJob missing elevatorId');
    });

    it('should throw an error if id is null', async () => {
      await expect(elevatorService.findElevatorRecordById(null)).rejects.toThrow('RepairJob missing elevatorId');
    });
  });

  describe('findElevatorRecordByRepairJob', () => {
    const repairJobMock = {
      ...mockRepairJob,
      id: 'test-repair-job-id',
      elevatorType: 'Scenic Elevator',
      buildingName: 'Skyline Plaza',
      elevatorLocation: 'Observation Deck',
      technicianId: 'test-technician-id-1',
    };

    it('should return elevator record by provided repair job', async () => {
      (elevatorRecordServicePrismaMock.elevatorRecord.findFirst as jest.Mock).mockResolvedValue(mockElevatorRecord);

      const result = await elevatorService.findElevatorRecordByRepairJob(repairJobMock);

      expect(elevatorRecordServicePrismaMock.elevatorRecord.findFirst).toHaveBeenCalledWith({
        where: {
          buildingName: mockElevatorRecord.buildingName,
          elevatorLocation: mockElevatorRecord.elevatorLocation,
          elevatorType: mockElevatorRecord.elevatorType,
        },
      });
      expect(result).toEqual(mockElevatorRecord);
    });
  });

  describe('getElevatorRecordFormData', () => {
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
      const result = await elevatorService.getElevatorRecordFormData();

      expect(fetchFormDropdownData).toHaveBeenCalledTimes(4);
      expect(result).toEqual({
        elevatorTypes: 'mocked dropdown for elevator types',
        buildingNames: 'mocked dropdown for building names',
        elevatorLocations: 'mocked dropdown for elevator locations',
        elevatorStatuses: 'mocked dropdown for elevator record statutes',
      });
    });
  });

  describe('getElevatorRecordsMetrics', () => {
    const mockElevatorRecords = {
      edges: [
        { node: { ...mockElevatorRecord }, cursor: mockElevatorRecord.id },
        {
          node: {
            ...mockElevatorRecord,
            id: 'test-id-2',
            elevatorType: 'Glass Elevator',
            buildingName: 'Silverhill Apartments',
            elevatorLocation: 'Penthouse',
          },
          cursor: 'test-id-2',
        },
      ],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: '',
        endCursor: '',
      },
      total: 2,
    };

    beforeEach(() => {
      jest.spyOn(elevatorService, 'getElevatorRecords').mockResolvedValue(mockElevatorRecords);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should calculate elevator records metrics correctly', async () => {
      const result = await elevatorService.getElevatorRecordsMetrics();

      expect(result).toEqual({
        freightElevators: 0,
        homeElevators: 0,
        luxuryHighSpeedElevators: 0,
        operationalElevators: 2,
        outOfServiceElevators: 0,
        passengerElevators: 2,
        pausedElevators: 0,
        serviceElevators: 0,
        specialtyElevators: 0,
        totalElevatorRecords: 2,
        underMaintenanceElevators: 0,
        vehicleParkingElevators: 0,
      });
    });
  });

  describe('updateElevatorRecord', () => {
    const updatedCapacity = 500;

    const mockInput: UpdateElevatorRecordInput = {
      id: mockElevatorRecordId,
      capacity: updatedCapacity,
    };

    const mockUpdatedElevatorRecord = {
      ...mockElevatorRecord,
      capacity: updatedCapacity,
    };

    it('should update elevator record', async () => {
      (elevatorRecordServicePrismaMock.elevatorRecord.update as jest.Mock).mockResolvedValue(mockUpdatedElevatorRecord);

      const result = await elevatorService.updateElevatorRecord(mockInput);

      expect(elevatorRecordServicePrismaMock.elevatorRecord.update).toHaveBeenCalledWith({
        data: { capacity: 500 },
        where: { id: 'test_id' },
      });
      expect(result).toEqual(mockUpdatedElevatorRecord);
    });
  });

  describe('deleteElevatorRecord', () => {
    it('should delete elevator record by id', async () => {
      (elevatorRecordServicePrismaMock.elevatorRecord.delete as jest.Mock).mockResolvedValue(mockElevatorRecord);

      const result = await elevatorService.deleteElevatorRecord(mockElevatorRecordId);

      expect(elevatorRecordServicePrismaMock.elevatorRecord.delete).toHaveBeenCalledWith({
        where: { id: mockElevatorRecordId },
      });
      expect(result).toEqual(mockElevatorRecord);
    });
  });

  describe('updateElevatorStatus', () => {
    const updatedCStatus = 'In Progress';

    const mockUpdatedElevatorRecord = {
      ...mockElevatorRecord,
      capacity: updatedCStatus,
    };

    it('should update elevator record status', async () => {
      (elevatorRecordServicePrismaMock.elevatorRecord.update as jest.Mock).mockResolvedValue(mockUpdatedElevatorRecord);

      const result = await elevatorService.updateElevatorStatus(mockElevatorRecordId, updatedCStatus);

      expect(elevatorRecordServicePrismaMock.elevatorRecord.update).toHaveBeenCalledWith({
        data: { status: 'In Progress' },
        where: { id: 'test_id' },
      });
      expect(result).toEqual(mockUpdatedElevatorRecord);
    });
  });

  describe('updateElevatorMaintenanceDates', () => {
    const mockDate = new Date('2025-01-01T00:00:00.000Z');
    const mockElevatorType = 'Freight Elevator';

    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(mockDate);
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.useRealTimers();
    });

    it('should update maintenance dates based on elevator type interval', async () => {
      await elevatorService.updateElevatorMaintenanceDates(mockElevatorRecordId, mockElevatorType);

      const expectedNextMaintenanceDate = addMonths(mockDate, 4); // Freight Elevator → 4 months

      expect(elevatorRecordServicePrismaMock.elevatorRecord.update).toHaveBeenCalledWith({
        where: { id: mockElevatorRecordId },
        data: {
          lastMaintenanceDate: mockDate,
          nextMaintenanceDate: expectedNextMaintenanceDate,
        },
      });
    });
  });

  describe('completeElevatorInspection', () => {
    const mockDate = new Date('2025-02-02T10:00:00.000Z');

    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(mockDate);
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.useRealTimers();
    });

    it('should complete elevator inspection and update inspection dates', async () => {
      await elevatorService.completeElevatorInspection(mockElevatorRecordId);

      const expectedNextInspectionDate = addMonths(mockDate, DEFAULT_ELEVATOR_SCHEDULED_INTERVAL_MONTHS);

      expect(elevatorRecordServicePrismaMock.elevatorRecord.update).toHaveBeenCalledWith({
        where: { id: mockElevatorRecordId },
        data: {
          lastInspectionDate: mockDate,
          nextInspectionDate: expectedNextInspectionDate,
        },
      });
    });
  });
});
