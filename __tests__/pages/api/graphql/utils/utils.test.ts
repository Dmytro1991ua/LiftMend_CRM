import { PassThrough } from 'stream';

import { RepairJob } from '@prisma/client';
import DataLoader from 'dataloader';
import { Kind } from 'graphql';

import {
  ElevatorRecordSortField,
  OrderOption,
  RepairJobSortField,
  TechnicianRecordSortField,
} from '@/graphql/types/server/generated_types';
import { mockNewRepairJobInput } from '@/mocks/repairJobScheduling';
import { mockRepairJob } from '@/mocks/repairJobTrackingMocks';
import { INACTIVE_REPAIR_JOB_STATUSES } from '@/pages/api/graphql/constants';
import {
  boolToStringArray,
  convertStreamToBuffer,
  createElevatorRecordFilterOptions,
  createElevatorRecordSortOptions,
  createNotificationFilterOptions,
  createRepairJobFilterOptions,
  createRepairJobSortOptions,
  createTechnicianRecordFilterOptions,
  createTechnicianRecordSortOptions,
  fetchFormDropdownData,
  getDataLoader,
  getElevatorStatusErrorMessage,
  getSortedFormDropdownData,
  isRepairJobOverdue,
  isRepairJobUpcoming,
  isRepairJobUrgent,
  makeConnectionObject,
  parseOAuthFullName,
  stringToBool,
} from '@/pages/api/graphql/utils/utils';

type TestItem = { id: string; name: string };

jest.mock('dataloader', () => {
  return jest.fn().mockImplementation(() => ({
    load: jest.fn(),
  }));
});

describe('utils', () => {
  describe('getSortedFormDropdownData', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call findMany on model and returns sorted flattened array', async () => {
      const mockData = [{ tags: ['z', 'a'] }, { tags: ['c', 'b'] }, { tags: ['d'] }];

      const model = {
        findMany: jest.fn().mockResolvedValue(mockData),
      };

      const result = await getSortedFormDropdownData(model, 'tags');

      expect(model.findMany).toHaveBeenCalled();
      expect(result).toEqual(['a', 'b', 'c', 'd', 'z']);
    });

    it('should return empty array if findMany returns empty', async () => {
      const model = {
        findMany: jest.fn().mockResolvedValue([]),
      };

      const result = await getSortedFormDropdownData(model, 'tags');

      expect(model.findMany).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('fetchFormDropdownData', () => {
    const mockLabel = 'test-label';

    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation(jest.fn());
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return data when fetchFunction resolves successfully', async () => {
      const mockData = { some: 'data' };
      const fetchFunction = jest.fn().mockResolvedValue(mockData);

      const result = await fetchFormDropdownData(fetchFunction, mockLabel);

      expect(fetchFunction).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('should throw an error with custom message when fetchFunction rejects', async () => {
      const mockErrorMessage = 'Network error';

      const fetchFunction = jest.fn().mockRejectedValue(new Error(mockErrorMessage));

      await expect(fetchFormDropdownData(fetchFunction, mockLabel)).rejects.toThrow(
        `Failed to fetch ${mockLabel}: ${mockErrorMessage}`
      );

      expect(fetchFunction).toHaveBeenCalled();
    });

    it('should log error to console when fetchFunction rejects', async () => {
      const mockErrorMessage = 'Network error';

      const fetchFunction = jest.fn().mockRejectedValue(new Error(mockErrorMessage));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await expect(fetchFormDropdownData(fetchFunction, mockLabel)).rejects.toThrow(
        `Failed to fetch ${mockLabel}: ${mockErrorMessage}`
      );

      expect(consoleSpy).toHaveBeenCalledWith(`Error fetching ${mockLabel}:`, expect.any(Error));
    });
  });

  describe('makeConnectionObject', () => {
    const mockGetCursor = (item: TestItem) => item.id;

    const mockTestScenarios = [
      {
        items: [{ id: '1', name: 'test_item_1' }],
        totalItems: 1,
        paginationOptions: { limit: 10, offset: 0 },
        expected: {
          edges: [{ cursor: '1', node: { id: '1', name: 'test_item_1' } }],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: '1',
            endCursor: '1',
          },
          total: 1,
        },
      },
      {
        items: [{ id: '2', name: 'test_item_2' }],
        totalItems: 1,
        paginationOptions: { limit: 10, offset: 5 },
        expected: {
          edges: [{ cursor: '2', node: { id: '2', name: 'test_item_2' } }],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: true,
            startCursor: '2',
            endCursor: '2',
          },
          total: 1,
        },
      },
      {
        items: [
          { id: '3', name: 'test_item_3' },
          { id: '4', name: 'test_item_4' },
        ],
        totalItems: 2,
        paginationOptions: { limit: 10, offset: 0 },
        expected: {
          edges: [
            { cursor: '3', node: { id: '3', name: 'test_item_3' } },
            { cursor: '4', node: { id: '4', name: 'test_item_4' } },
          ],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: '3',
            endCursor: '4',
          },
          total: 2,
        },
      },
      {
        items: [
          { id: '5', name: 'test_item_5' },
          { id: '6', name: 'test_item_6' },
        ],
        totalItems: 30,
        paginationOptions: { limit: 10, offset: 10 },
        expected: {
          edges: [
            { cursor: '5', node: { id: '5', name: 'test_item_5' } },
            { cursor: '6', node: { id: '6', name: 'test_item_6' } },
          ],
          pageInfo: {
            hasNextPage: true,
            hasPreviousPage: true,
            startCursor: '5',
            endCursor: '6',
          },
          total: 30,
        },
      },
      {
        items: [],
        totalItems: 0,
        paginationOptions: null,
        expected: {
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
          },
          total: 0,
        },
      },
    ];

    afterEach(() => {
      jest.clearAllMocks();
    });

    mockTestScenarios.forEach(({ items, totalItems, paginationOptions, expected }, idx) => {
      it(`should create correct connection object for scenario #${idx + 1}`, () => {
        const result = makeConnectionObject<TestItem>({
          items,
          totalItems,
          paginationOptions: paginationOptions ?? undefined,
          getCursor: mockGetCursor,
        });

        expect(result).toEqual(expected);
      });
    });
  });

  describe('stringToBool', () => {
    it('should return true if passed string as prop is Yes', () => {
      expect(stringToBool('Yes')).toEqual(true);
    });

    it('should return false if passed string as prop is No', () => {
      expect(stringToBool('No')).toEqual(false);
    });
  });

  describe('boolToStringArray', () => {
    it('should return Yes string as array if passed value as prop is true', () => {
      expect(boolToStringArray(true)).toEqual(['Yes']);
    });

    it('should return No string as array if passed value as prop is false', () => {
      expect(boolToStringArray(false)).toEqual(['No']);
    });
  });

  describe('createRepairJobFilterOptions', () => {
    const mockScenarios = [
      {
        name: 'should return empty object when called with undefined',
        input: undefined,
        expected: {},
      },
      {
        name: 'should return empty object when called with null',
        input: null,
        expected: {},
      },
      {
        name: 'should include id when searchTerm is provided',
        input: { searchTerm: 'abc123' },
        expected: { id: 'abc123' },
      },
      {
        name: 'should include jobType with "in" when jobType array is non-empty',
        input: { jobType: ['Repair', 'Maintenance'] },
        expected: { jobType: { in: ['Repair', 'Maintenance'] } },
      },
      {
        name: 'should omit jobType when jobType array is empty',
        input: { jobType: [] },
        expected: {},
      },
      {
        name: 'should include jobPriority with "in" when jobPriority array is non-empty',
        input: { jobPriority: ['High'] },
        expected: { jobPriority: { in: ['High'] } },
      },
      {
        name: 'should include multiple array filters when non-empty',
        input: {
          elevatorType: ['TypeA'],
          buildingName: ['Building1'],
          elevatorLocation: ['Loc1'],
          technicianName: ['Tech1'],
          status: ['Scheduled'],
        },
        expected: {
          elevatorType: { in: ['TypeA'] },
          buildingName: { in: ['Building1'] },
          elevatorLocation: { in: ['Loc1'] },
          technicianName: { in: ['Tech1'] },
          status: { in: ['Scheduled'] },
        },
      },
      {
        name: 'should omit multiple array filters when empty',
        input: {
          elevatorType: [],
          buildingName: [],
          elevatorLocation: [],
          technicianName: [],
          status: [],
        },
        expected: {},
      },
      {
        name: 'should include isOverdue as true when isOverdue array has "Yes"',
        input: { isOverdue: ['Yes'] },
        expected: { isOverdue: true },
      },
      {
        name: 'should include isOverdue as false when isOverdue array has "No"',
        input: { isOverdue: ['No'] },
        expected: { isOverdue: false },
      },
      {
        name: 'should set isOverdue undefined when isOverdue array is empty',
        input: { isOverdue: [] },
        expected: {},
        stringToBoolReturn: null,
      },
      {
        name: 'should omit isOverdue when not provided',
        input: {},
        expected: {},
        stringToBoolReturn: null,
      },
    ];

    mockScenarios.forEach(({ name, input, expected }) => {
      it(name, () => {
        expect(createRepairJobFilterOptions(input)).toEqual(expected);
      });
    });
  });

  describe('createRepairJobSortOptions', () => {
    const mockScenarios = [
      {
        name: 'should return empty object if sortOptions is undefined',
        input: undefined,
        expected: {},
      },
      {
        name: 'should return empty object if sortOptions is null',
        input: null,
        expected: {},
      },
      {
        name: 'should return empty object if field is missing',
        input: { order: OrderOption.Asc },
        expected: {},
      },
      {
        name: 'should return empty object if order is missing',
        input: { field: RepairJobSortField.JobType },
        expected: {},
      },
      {
        name: 'should return correct sort option for JobType ASC',
        input: { field: RepairJobSortField.JobType, order: OrderOption.Asc },
        expected: { jobType: 'asc' },
      },
      {
        name: 'should return correct sort option for JobPriority DESC',
        input: { field: RepairJobSortField.JobPriority, order: OrderOption.Desc },
        expected: { jobPriority: 'desc' },
      },
      {
        name: 'should return correct sort option for Status ASC',
        input: { field: RepairJobSortField.Status, order: OrderOption.Asc },
        expected: { status: 'asc' },
      },
    ];

    mockScenarios.forEach(({ name, input, expected }) => {
      it(name, () => {
        expect(createRepairJobSortOptions(input)).toEqual(expected);
      });
    });
  });

  describe('createElevatorRecordFilterOptions', () => {
    const mockScenarios = [
      {
        name: 'should return empty object when input is undefined',
        input: undefined,
        expected: {},
      },
      {
        name: 'should return empty object when input is null',
        input: null,
        expected: {},
      },
      {
        name: 'should include id when searchTerm is provided',
        input: { searchTerm: 'abc123' },
        expected: { id: 'abc123' },
      },
      {
        name: 'should include elevatorType with "in" when elevatorType array is non-empty',
        input: { elevatorType: ['TypeA', 'TypeB'] },
        expected: { elevatorType: { in: ['TypeA', 'TypeB'] } },
      },
      {
        name: 'should omits elevatorType when array is empty',
        input: { elevatorType: [] },
        expected: {},
      },
      {
        name: 'should include buildingName with "in" when buildingName array is non-empty',
        input: { buildingName: ['Building1'] },
        expected: { buildingName: { in: ['Building1'] } },
      },
      {
        name: 'should omit buildingName when array is empty',
        input: { buildingName: [] },
        expected: {},
      },
      {
        name: 'should includes elevatorLocation with "in" when elevatorLocation array is non-empty',
        input: { elevatorLocation: ['Loc1'] },
        expected: { elevatorLocation: { in: ['Loc1'] } },
      },
      {
        name: 'should omit elevatorLocation when array is empty',
        input: { elevatorLocation: [] },
        expected: {},
      },
      {
        name: 'should include status with "in" when status array is non-empty',
        input: { status: ['Active'] },
        expected: { status: { in: ['Active'] } },
      },
      {
        name: 'should omit status when array is empty',
        input: { status: [] },
        expected: {},
      },
      {
        name: 'should include multiple filters when provided',
        input: {
          searchTerm: 'search',
          elevatorType: ['TypeA'],
          buildingName: ['Building1'],
          elevatorLocation: ['Loc1'],
          status: ['Active'],
        },
        expected: {
          id: 'search',
          elevatorType: { in: ['TypeA'] },
          buildingName: { in: ['Building1'] },
          elevatorLocation: { in: ['Loc1'] },
          status: { in: ['Active'] },
        },
      },
    ];

    mockScenarios.forEach(({ name, input, expected }) => {
      it(name, () => {
        expect(createElevatorRecordFilterOptions(input)).toEqual(expected);
      });
    });
  });

  describe('createElevatorRecordSortOptions', () => {
    const mockScenarios = [
      {
        name: 'should return empty object when input is undefined',
        input: undefined,
        expected: {},
      },
      {
        name: 'should return empty object when input is null',
        input: null,
        expected: {},
      },
      {
        name: 'should return empty object when field is missing',
        input: { order: OrderOption.Asc },
        expected: {},
      },
      {
        name: 'should return empty object when order is missing',
        input: { field: ElevatorRecordSortField.Status },
        expected: {},
      },
      {
        name: 'should map field and lowercases order ASC',
        input: { field: ElevatorRecordSortField.Status, order: OrderOption.Asc },
        expected: { status: 'asc' },
      },
      {
        name: 'should map field and lowercases order DESC',
        input: { field: ElevatorRecordSortField.LastMaintenanceDate, order: OrderOption.Desc },
        expected: { lastMaintenanceDate: 'desc' },
      },
      {
        name: 'should map other fields correctly',
        input: { field: ElevatorRecordSortField.ElevatorType, order: OrderOption.Asc },
        expected: { elevatorType: 'asc' },
      },
    ];

    mockScenarios.forEach(({ name, input, expected }) => {
      it(name, () => {
        expect(createElevatorRecordSortOptions(input)).toEqual(expected);
      });
    });
  });

  describe('createTechnicianRecordFilterOptions', () => {
    const mockScenarios = [
      {
        name: 'should return empty object when called with undefined',
        input: undefined,
        expected: {},
      },
      {
        name: 'should return empty object when called with null',
        input: null,
        expected: {},
      },
      {
        name: 'should include id when searchTerm is provided',
        input: { searchTerm: 'tech123' },
        expected: { id: 'tech123' },
      },
      {
        name: 'should include availabilityStatus with "in" when non-empty array provided',
        input: { availabilityStatus: ['Available', 'Busy'] },
        expected: { availabilityStatus: { in: ['Available', 'Busy'] } },
      },
      {
        name: 'should omit availabilityStatus when empty array provided',
        input: { availabilityStatus: [] },
        expected: {},
      },
      {
        name: 'should include employmentStatus with "in" when non-empty array provided',
        input: { employmentStatus: ['FullTime'] },
        expected: { employmentStatus: { in: ['FullTime'] } },
      },
      {
        name: 'should include skills with "hasSome" when non-empty array provided',
        input: { skills: ['Electrical', 'Mechanical'] },
        expected: { skills: { hasSome: ['Electrical', 'Mechanical'] } },
      },
      {
        name: 'should omit skills when empty array provided',
        input: { skills: [] },
        expected: {},
      },
      {
        name: 'should include certifications with "hasSome" when non-empty array provided',
        input: { certifications: ['CertA'] },
        expected: { certifications: { hasSome: ['CertA'] } },
      },
      {
        name: 'should omit certifications when empty array provided',
        input: { certifications: [] },
        expected: {},
      },
      {
        name: 'should include multiple filters together',
        input: {
          searchTerm: 'tech001',
          availabilityStatus: ['Available'],
          employmentStatus: ['PartTime'],
          skills: ['HVAC'],
          certifications: ['CertB'],
        },
        expected: {
          id: 'tech001',
          availabilityStatus: { in: ['Available'] },
          employmentStatus: { in: ['PartTime'] },
          skills: { hasSome: ['HVAC'] },
          certifications: { hasSome: ['CertB'] },
        },
      },
    ];

    mockScenarios.forEach(({ name, input, expected }) => {
      it(name, () => {
        expect(createTechnicianRecordFilterOptions(input)).toEqual(expected);
      });
    });
  });

  describe('createTechnicianRecordSortOptions', () => {
    const mockScenarios = [
      {
        name: 'should return empty object when called with undefined',
        input: undefined,
        expected: {},
      },
      {
        name: 'should return empty object when called with null',
        input: null,
        expected: {},
      },
      {
        name: 'should return empty object when field is missing',
        input: { order: OrderOption.Asc },
        expected: {},
      },
      {
        name: 'should return empty object when order is missing',
        input: { field: TechnicianRecordSortField.Name },
        expected: {},
      },
      {
        name: 'should map field and order correctly when both provided (Name, ASC)',
        input: { field: TechnicianRecordSortField.Name, order: OrderOption.Asc },
        expected: { name: 'asc' },
      },
      {
        name: 'should map field and order correctly when both provided (AvailabilityStatus, DESC)',
        input: { field: TechnicianRecordSortField.AvailabilityStatus, order: OrderOption.Desc },
        expected: { availabilityStatus: 'desc' },
      },
      {
        name: 'should map field and order correctly when both provided (EmploymentStatus, asc)',
        input: { field: TechnicianRecordSortField.EmploymentStatus, order: OrderOption.Asc },
        expected: { employmentStatus: 'asc' },
      },
    ];

    mockScenarios.forEach(({ name, input, expected }) => {
      it(name, () => {
        expect(createTechnicianRecordSortOptions(input)).toEqual(expected);
      });
    });
  });
  describe('getElevatorStatusErrorMessage', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return correct message for "Under Maintenance"', () => {
      const result = getElevatorStatusErrorMessage(mockNewRepairJobInput);

      expect(result['Under Maintenance']).toBe(
        'Elevator (Eco-Friendly Elevator) in Restaurant, Bluewater Hotel is already Under Maintenance. Repair job cannot be created.'
      );
    });

    it('should return correct message for "Out of Service"', () => {
      const result = getElevatorStatusErrorMessage(mockNewRepairJobInput);

      expect(result['Out of Service']).toBe(
        'Cannot create repair job. Elevator (Eco-Friendly Elevator) in Restaurant, Bluewater Hotel is Out of Service and Inactive. Reactivate it in the Elevator Management page before creating a repair job.'
      );
    });
  });

  describe('parseOAuthFullName', () => {
    const mockScenarios = [
      {
        name: 'should return full name with first and last',
        input: 'John Doe',
        expected: { firstName: 'John', lastName: 'Doe' },
      },
      {
        name: 'should return a single word name',
        input: 'Jane',
        expected: { firstName: 'Jane', lastName: 'Jane' },
      },
      {
        name: 'should return a empty string',
        input: '',
        expected: { firstName: '', lastName: '' },
      },
      {
        name: 'should return a full name with middle name',
        input: 'Anna Maria Smith',
        expected: { firstName: 'Anna', lastName: 'Smith' },
      },
      {
        name: 'should return name with multiple spaces',
        input: '   Multiple   Spaces Here  ',
        expected: { firstName: 'Multiple', lastName: 'Here' },
      },
    ];

    mockScenarios.forEach(({ name, input, expected }) => {
      it(`should parse fullName correctly when ${name}`, () => {
        expect(parseOAuthFullName(input)).toEqual(expected);
      });
    });
  });

  describe('convertStreamToBuffer', () => {
    let mockStream: PassThrough;

    const mockDataChunks = [Buffer.from('hello'), Buffer.from(' '), Buffer.from('world')];

    beforeEach(() => {
      mockStream = new PassThrough();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should concatenate multiple chunks into a single buffer', async () => {
      // Use process.nextTick to asynchronously push chunks after the current call stack clears,
      // ensuring event listeners are set up before emitting events.
      process.nextTick(() => {
        mockDataChunks.forEach((chunk) => mockStream.write(chunk));
        mockStream.end();
      });

      const result = await convertStreamToBuffer(mockStream);
      expect(result.toString()).toBe('hello world');
    });

    it('should resolve to an empty buffer if no data chunks', async () => {
      // Asynchronously end the stream after event listeners are registered
      process.nextTick(() => mockStream.end());

      const result = await convertStreamToBuffer(mockStream);
      expect(result.length).toBe(0);
    });

    it('should reject the promise if stream emits error', async () => {
      const error = new Error('Stream error');

      // Emit error asynchronously to ensure listeners are attached before error is emitted
      process.nextTick(() => mockStream.emit('error', error));

      await expect(convertStreamToBuffer(mockStream)).rejects.toThrow('Stream error');
    });
  });

  describe('getDataLoader', () => {
    it('should return an existing data loader from the WeakMap', () => {
      const fieldNodes = [{ kind: Kind.FIELD, name: { kind: Kind.NAME, value: 'Test' } }] as const;

      const dataloaders = new WeakMap();
      const batchDataIds = jest.fn();

      // DON'T call new DataLoader() or you'll increment the counter!
      const existingLoader = { load: jest.fn() };

      dataloaders.set(fieldNodes, existingLoader);

      const result = getDataLoader(dataloaders, fieldNodes, batchDataIds);

      expect(result).toBe(existingLoader);
      expect(DataLoader).toHaveBeenCalledTimes(0);
    });

    it('should create a new data loader if one does not exist', () => {
      const fieldNodes = [{ kind: Kind.FIELD, name: { kind: Kind.NAME, value: 'Test' } }] as const;

      const dataloaders = new WeakMap();
      const batchDataIds = jest.fn();

      const result = getDataLoader(dataloaders, fieldNodes, batchDataIds);

      expect(DataLoader).toHaveBeenCalledTimes(1);
      expect(DataLoader).toHaveBeenCalledWith(batchDataIds);
      expect(result).toBeInstanceOf(Object);
    });
  });
});

describe('isRepairJobOverdue', () => {
  const yesterday = new Date(Date.now() - 86400000);
  const tomorrow = new Date(Date.now() + 86400000);

  const nockScenarios = [
    {
      name: 'planned end date is past and repair status is active',
      plannedEndDate: yesterday,
      status: 'Scheduled',
      expected: true,
    },
    {
      name: 'planned end date is in the future and status is active',
      plannedEndDate: tomorrow,
      status: 'Scheduled',
      expected: false,
    },
    ...INACTIVE_REPAIR_JOB_STATUSES.map((status) => ({
      name: `planned end date is past but status is inactive (${status})`,
      plannedEndDate: yesterday,
      status,
      expected: false,
    })),
  ];

  nockScenarios.forEach(({ name, plannedEndDate, status, expected }) => {
    it(`should return ${expected} when ${name}`, () => {
      expect(isRepairJobOverdue(plannedEndDate, status)).toBe(expected);
    });
  });
});

describe('isRepairJobUpcoming', () => {
  const tomorrow = new Date(Date.now() + 86400000);
  const today = new Date();

  const mockScenarios = [
    {
      name: 'repair job starts tomorrow and status is active',
      job: { ...mockRepairJob, startDate: tomorrow } as unknown as RepairJob,
      expected: true,
    },
    {
      name: 'repair job starts tomorrow but status is inactive',
      job: { ...mockRepairJob, startDate: tomorrow, status: 'Completed' } as unknown as RepairJob,
      expected: false,
    },
    {
      name: 'repair job starts today and status is active',
      job: { ...mockRepairJob, startDate: today } as unknown as RepairJob,
      expected: false,
    },
  ];

  mockScenarios.forEach(({ name, job, expected }) => {
    it(`should return ${expected} when ${name}`, () => {
      expect(isRepairJobUpcoming(job, tomorrow)).toBe(expected);
    });
  });
});

describe('isRepairJobUrgent', () => {
  const mockScenarios = [
    {
      name: 'active job with High priority',
      job: { ...mockRepairJob, jobPriority: 'High' } as unknown as RepairJob,
      expected: true,
    },
    {
      name: 'active job with Low priority',
      job: { ...mockRepairJob, jobPriority: 'Low' } as unknown as RepairJob,
      expected: false,
    },
    {
      name: 'inactive job with High priority',
      job: { ...mockRepairJob, status: 'Completed', jobPriority: 'High' } as unknown as RepairJob,
      expected: false,
    },
  ];

  mockScenarios.forEach(({ name, job, expected }) => {
    it(`should return ${expected} when ${name}`, () => {
      expect(isRepairJobUrgent(job)).toBe(expected);
    });
  });
});

describe('createNotificationFilterOptions', () => {
  const scenarios = [
    {
      description: 'should return an empty object when no filter options are provided',
      input: undefined,
      expected: {},
    },
    {
      description: 'should return only status if status is provided',
      input: { status: ['Unread'] },
      expected: { status: { in: ['Unread'] } },
    },
    {
      description: 'should return only category if category is provided',
      input: { category: ['Urgent'] },
      expected: { category: { in: ['Urgent'] } },
    },
    {
      description: 'should return both status and category if both are provided',
      input: { status: ['Unread'], category: ['Urgent'] },
      expected: { status: { in: ['Unread'] }, category: { in: ['Urgent'] } },
    },
    {
      description: 'should ignore falsy values for status and category',
      input: { status: [], category: undefined },
      expected: {},
    },
  ];

  scenarios.forEach(({ description, input, expected }) => {
    it(description, () => {
      const result = createNotificationFilterOptions(input);

      expect(result).toEqual(expected);
    });
  });
});
