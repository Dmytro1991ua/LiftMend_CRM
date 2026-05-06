import { QueryGetInventoryPartsArgs } from '@/graphql/types/server/generated_types';
import { inventoryPartServicePrismaMock } from '@/mocks/gql/prismaMocks';
import { mockDoorSensorInventoryPart } from '@/mocks/inventoryPartMocks';
import { DEFAULT_SORTING_OPTION } from '@/pages/api/graphql/dataSources/constants';
import InventoryPartService from '@/pages/api/graphql/dataSources/InventoryPartService';
import {
  createInventoryPartFilterOptions,
  createInventoryPartSortOptions,
  makeConnectionObject,
} from '@/pages/api/graphql/utils/utils';

jest.mock('@/pages/api/graphql/utils/utils', () => ({
  ...jest.requireActual('@/pages/api/graphql/utils/utils'),
  makeConnectionObject: jest.fn(),
  createInventoryPartFilterOptions: jest.fn(),
  createInventoryPartSortOptions: jest.fn(),
}));

describe('InventoryPartService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const inventoryPartService = new InventoryPartService(inventoryPartServicePrismaMock);

  describe('inventoryParts', () => {
    const mockArgs = {
      paginationOptions: { offset: 5, limit: 10 },
      filterOptions: { status: 'In Stock' },
    } as unknown as QueryGetInventoryPartsArgs;

    const mockFilters = { status: 'In Stock' };
    const mockOrderBy = { createdAt: DEFAULT_SORTING_OPTION };
    const mockTotalItems = 2;
    const mockInventoryParts = [
      mockDoorSensorInventoryPart,
      {
        ...mockDoorSensorInventoryPart,
        id: 'test-inventory-part-id-2',
        message: 'test-message',
        priority: 'Out of Stock',
      },
    ];
    const mockConnection = {
      edges: [],
      pageInfo: {},
      totalCount: mockTotalItems,
    };

    beforeEach(() => {
      (createInventoryPartFilterOptions as jest.Mock).mockReturnValue(mockFilters);
      (createInventoryPartSortOptions as jest.Mock).mockReturnValue(mockOrderBy);

      (makeConnectionObject as jest.Mock).mockReturnValue(mockConnection);
    });

    it('should fetch inventory parts with correct prisma calls and return connection object', async () => {
      (inventoryPartServicePrismaMock.inventoryPart.findMany as jest.Mock).mockResolvedValue(mockInventoryParts);
      (inventoryPartServicePrismaMock.inventoryPart.count as jest.Mock).mockResolvedValue(mockTotalItems);

      const result = await inventoryPartService.inventoryParts(mockArgs);

      expect(inventoryPartServicePrismaMock.inventoryPart.findMany).toHaveBeenCalledWith({
        where: mockFilters,
        orderBy: mockOrderBy,
        skip: 5,
        take: 10,
      });

      expect(inventoryPartServicePrismaMock.inventoryPart.count).toHaveBeenCalledWith({
        where: mockFilters,
      });

      expect(makeConnectionObject).toHaveBeenCalledWith({
        items: mockInventoryParts,
        totalItems: mockTotalItems,
        paginationOptions: mockArgs.paginationOptions,
        getCursor: expect.any(Function),
      });

      expect(result).toEqual(mockConnection);
    });
  });

  describe('inventoryPartDropdownOptions', () => {
    it('should return correctly mapped inventory parts dropdown options', async () => {
      const mockInventoryParts = [
        mockDoorSensorInventoryPart,
        {
          ...mockDoorSensorInventoryPart,
          id: 'test-inventory-part-id-2',
          message: 'test-message',
          priority: 'Out of Stock',
          stock: 0,
        },
      ];
      const mockOutput = [
        { disabledReason: null, isDisabled: false, label: 'Door Sensor (Infrared)', value: 'test_inventory_part_id' },
        {
          disabledReason: 'This inventory part is currently out of stock',
          isDisabled: true,
          label: 'Door Sensor (Infrared)',
          value: 'test-inventory-part-id-2',
        },
      ];

      (inventoryPartServicePrismaMock.inventoryPart.findMany as jest.Mock).mockResolvedValue(mockInventoryParts);

      const result = await inventoryPartService.inventoryPartDropdownOptions();

      expect(result).toEqual(mockOutput);
    });
  });
});
