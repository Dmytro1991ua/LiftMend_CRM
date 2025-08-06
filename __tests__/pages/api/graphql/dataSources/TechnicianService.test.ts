import {
  CreateTechnicianRecordInput,
  QueryGetTechnicianRecordsArgs,
  TechnicianRecord,
  UpdateTechnicianRecordInput,
} from '@/graphql/types/server/generated_types';
import { technicianRecordPrismaMock } from '@/mocks/gql/prismaMocks';
import {
  mockBenjaminHallRecord,
  mockJamesAndersonRecord,
  mockOliviaLewisRecord,
} from '@/mocks/technicianManagementMocks';
import { TECHNICIAN_ASSIGNMENT_BLOCKING_STATUSES } from '@/pages/api/graphql/constants';
import TechnicianService from '@/pages/api/graphql/dataSources/TechnicianService';
import {
  createTechnicianRecordFilterOptions,
  createTechnicianRecordSortOptions,
  fetchFormDropdownData,
  getSortedFormDropdownData,
  makeConnectionObject,
} from '@/pages/api/graphql/utils';

jest.mock('@/pages/api/graphql/utils', () => ({
  createTechnicianRecordFilterOptions: jest.fn(),
  createTechnicianRecordSortOptions: jest.fn(),
  makeConnectionObject: jest.fn(),
  fetchFormDropdownData: jest.fn(),
  getSortedFormDropdownData: jest.fn(),
}));

describe('TechnicianService', () => {
  const mockTechnicianRecords = [mockBenjaminHallRecord, mockOliviaLewisRecord, mockJamesAndersonRecord];

  afterEach(() => {
    jest.clearAllMocks();
  });

  const technicianService = new TechnicianService(technicianRecordPrismaMock);

  describe('getTechnicianRecords', () => {
    const mockArgs = {
      paginationOptions: { offset: 5, limit: 10 },
      sortOptions: { field: 'AVAILABILITY_STATUS', order: 'DESC' },
      filterOptions: { availableStatus: 'active' },
    } as unknown as QueryGetTechnicianRecordsArgs;

    const mockFilters = { availableStatus: 'active' };
    const mockOrderBy = { availableStatus: 'desc' };
    const mockTotalItems = 3;
    const mockConnection = {
      edges: [],
      pageInfo: {},
      totalCount: mockTotalItems,
    };

    beforeEach(() => {
      (createTechnicianRecordFilterOptions as jest.Mock).mockReturnValue(mockFilters);
      (createTechnicianRecordSortOptions as jest.Mock).mockReturnValue(mockOrderBy);
      (makeConnectionObject as jest.Mock).mockReturnValue(mockConnection);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should fetch technician records with correct prisma calls and return connection object', async () => {
      (technicianRecordPrismaMock.technicianRecord.findMany as jest.Mock).mockResolvedValue(mockTechnicianRecords);
      (technicianRecordPrismaMock.technicianRecord.count as jest.Mock).mockResolvedValue(mockTotalItems);

      const result = await technicianService.getTechnicianRecords(mockArgs);

      expect(technicianRecordPrismaMock.technicianRecord.findMany).toHaveBeenCalledWith();

      expect(technicianRecordPrismaMock.technicianRecord.count).toHaveBeenCalledWith({
        where: mockFilters,
      });

      expect(makeConnectionObject).toHaveBeenCalledWith({
        items: mockTechnicianRecords,
        totalItems: mockTotalItems,
        paginationOptions: mockArgs.paginationOptions,
        getCursor: expect.any(Function),
      });

      const getCursorFn = (makeConnectionObject as jest.Mock).mock.calls[0][0].getCursor;
      expect(getCursorFn({ id: 'abc-123' } as TechnicianRecord)).toBe('abc-123');

      expect(result).toEqual(mockConnection);
    });
  });

  describe('findTechnicianRecordByName', () => {
    it('should return technician record by name', async () => {
      (technicianRecordPrismaMock.technicianRecord.findFirst as jest.Mock).mockResolvedValue(mockBenjaminHallRecord);

      const result = await technicianService.findTechnicianRecordByName('Benjamin Hall');

      expect(technicianRecordPrismaMock.technicianRecord.findFirst).toHaveBeenCalledWith({
        where: { name: 'Benjamin Hall' },
      });
      expect(result).toEqual(mockBenjaminHallRecord);
    });
  });

  describe('findTechnicianRecordById', () => {
    it('should return technician record by id', async () => {
      (technicianRecordPrismaMock.technicianRecord.findUnique as jest.Mock).mockResolvedValue(mockOliviaLewisRecord);

      const result = await technicianService.findTechnicianRecordById(mockOliviaLewisRecord.id);

      expect(technicianRecordPrismaMock.technicianRecord.findUnique).toHaveBeenCalledWith({
        where: { id: mockOliviaLewisRecord.id },
      });
      expect(result).toEqual(mockOliviaLewisRecord);
    });
  });

  describe('getTechnicianRecordFormData', () => {
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
      const result = await technicianService.getTechnicianRecordFormData();

      expect(fetchFormDropdownData).toHaveBeenCalledTimes(4);
      expect(result).toEqual({
        availabilityStatuses: 'mocked dropdown for availability statuses',
        certifications: 'mocked dropdown for certifications',
        employmentStatuses: 'mocked dropdown for employment statuses',
        skills: 'mocked dropdown for technician skills',
      });
    });
  });

  describe('getAvailableTechniciansForAssignment', () => {
    const mockedTechnicianRecords = [
      mockBenjaminHallRecord,
      { ...mockJamesAndersonRecord, availabilityStatus: 'Unavailable' },
      { ...mockOliviaLewisRecord, availabilityStatus: 'On Leave' },
    ];

    it('should return technicians whose status is not in blocking statuses', async () => {
      (technicianRecordPrismaMock.technicianRecord.findMany as jest.Mock).mockResolvedValue(mockedTechnicianRecords);

      const result = await technicianService.getAvailableTechniciansForAssignment();

      expect(technicianRecordPrismaMock.technicianRecord.findMany).toHaveBeenCalledWith({
        where: {
          availabilityStatus: {
            notIn: TECHNICIAN_ASSIGNMENT_BLOCKING_STATUSES,
          },
        },
      });

      expect(result).toEqual(mockedTechnicianRecords);
    });
  });

  describe('getTechnicianRecordsMetrics', () => {
    const mockTechnicianRecords = {
      edges: [
        { node: { ...mockBenjaminHallRecord }, cursor: mockBenjaminHallRecord.id },
        {
          node: {
            ...mockJamesAndersonRecord,
            availabilityStatus: 'Busy',
          },
          cursor: mockJamesAndersonRecord.id,
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
      jest.spyOn(technicianService, 'getTechnicianRecords').mockResolvedValue(mockTechnicianRecords);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should calculate technician records metrics correctly', async () => {
      const result = await technicianService.getTechnicianRecordsMetrics();

      expect(result).toEqual({
        availableTechnicians: 1,
        busyTechnicians: 1,
        inactiveTechnicians: 0,
        onLeaveTechnicians: 0,
        reservedTechnicians: 0,
        totalTechnicianRecords: 2,
        unavailableTechnicians: 0,
      });
    });
  });

  describe('createTechnicianRecord', () => {
    const mockInput: CreateTechnicianRecordInput = {
      name: 'Alex Smith',
      contactInformation: 'test@gmail.com',
      skills: ['Test skill'],
      certifications: ['Test certification'],
      availabilityStatus: 'Available',
      employmentStatus: 'Active',
    };

    const mockNewlyCreateTechnician = {
      ...mockInput,
      id: 'test-technician-id',
    };

    it('should create a new technician', async () => {
      (technicianRecordPrismaMock.technicianRecord.create as jest.Mock).mockResolvedValue(mockNewlyCreateTechnician);

      const result = await technicianService.createTechnicianRecord(mockInput);

      expect(technicianRecordPrismaMock.technicianRecord.create).toHaveBeenCalledWith({
        data: mockInput,
      });
      expect(result).toEqual(mockNewlyCreateTechnician);
    });
  });

  describe('updateTechnicianRecord', () => {
    const mockNewCertificate = 'Test new certificate';
    const mockNewSkill = 'Test new skill';

    const mockInput: UpdateTechnicianRecordInput = {
      id: mockBenjaminHallRecord.id,
      certifications: [mockNewCertificate],
    };

    const mockUpdatedTechnicianRecord = {
      ...mockBenjaminHallRecord,
      certifications: [mockNewCertificate],
    };

    it('should update technician record', async () => {
      (technicianRecordPrismaMock.technicianRecord.update as jest.Mock).mockResolvedValue(mockUpdatedTechnicianRecord);

      const result = await technicianService.updateTechnicianRecord(mockInput);

      expect(technicianRecordPrismaMock.technicianRecord.update).toHaveBeenCalledWith({
        data: { certifications: [mockNewCertificate] },
        where: { id: mockBenjaminHallRecord.id },
      });
      expect(result).toEqual(mockUpdatedTechnicianRecord);
    });

    it('should omit null fields in update', async () => {
      const mockInput = { id: mockBenjaminHallRecord.id, certifications: null, skills: [mockNewSkill] };

      (technicianRecordPrismaMock.technicianRecord.update as jest.Mock).mockResolvedValue(mockBenjaminHallRecord);

      await technicianService.updateTechnicianRecord(mockInput);

      expect(technicianRecordPrismaMock.technicianRecord.update).toHaveBeenCalledWith({
        data: { skills: [mockNewSkill] },
        where: { id: mockBenjaminHallRecord.id },
      });
    });
  });

  describe('updateTechnicianStatus', () => {
    it('should update technician availability status', async () => {
      const mockNewAvailabilityStatus = 'Busy';
      const mockedTechnicianRecord = {
        ...mockBenjaminHallRecord,
        availabilityStatus: mockNewAvailabilityStatus,
      };

      (technicianRecordPrismaMock.technicianRecord.update as jest.Mock).mockResolvedValue(mockedTechnicianRecord);

      await technicianService.updateTechnicianStatus(mockBenjaminHallRecord.id, mockNewAvailabilityStatus);

      expect(technicianRecordPrismaMock.technicianRecord.update).toHaveBeenCalledWith({
        data: { availabilityStatus: mockNewAvailabilityStatus },
        where: { id: mockBenjaminHallRecord.id },
      });
    });
  });

  describe('deleteTechnicianRecord', () => {
    it('should delete technician record by id', async () => {
      (technicianRecordPrismaMock.technicianRecord.delete as jest.Mock).mockResolvedValue(mockBenjaminHallRecord);

      const result = await technicianService.deleteTechnicianRecord(mockBenjaminHallRecord.id);

      expect(technicianRecordPrismaMock.technicianRecord.delete).toHaveBeenCalledWith({
        where: { id: mockBenjaminHallRecord.id },
      });
      expect(result).toEqual(mockBenjaminHallRecord);
    });
  });

  describe('validateTechnicianAssignment', () => {
    const technicianName = 'Olivia Lewis';

    const mockAvailableTechnician = {
      ...mockOliviaLewisRecord,
      availabilityStatus: 'Available',
    };

    const mockBusyTechnician = {
      ...mockOliviaLewisRecord,
      availabilityStatus: 'Busy',
    };

    it('should return technician record if available', async () => {
      jest.spyOn(technicianService, 'findTechnicianRecordByName').mockResolvedValue(mockAvailableTechnician);

      const result = await technicianService.validateTechnicianAssignment(technicianName);

      expect(technicianService.findTechnicianRecordByName).toHaveBeenCalledWith(technicianName);
      expect(result).toEqual(mockAvailableTechnician);
    });

    it('should throw if technician record not found', async () => {
      jest.spyOn(technicianService, 'findTechnicianRecordByName').mockResolvedValue(null);

      await expect(technicianService.validateTechnicianAssignment(technicianName)).rejects.toThrow(
        `Technician record for ${technicianName} was not found`
      );
    });

    it('should throw if technician status is blocking', async () => {
      jest.spyOn(technicianService, 'findTechnicianRecordByName').mockResolvedValue(mockBusyTechnician);

      await expect(technicianService.validateTechnicianAssignment(technicianName)).rejects.toThrow(
        `Technician ${technicianName} is already assigned to another job. Please check the Repair Job Tracking page to see current assignments o select a different technician.`
      );
    });
  });
});
