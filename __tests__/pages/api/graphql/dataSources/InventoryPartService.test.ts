import { QueryGetInventoryPartsArgs } from '@/graphql/types/server/generated_types';
import { inventoryPartServicePrismaMock } from '@/mocks/gql/prismaMocks';
import { mockInventoryPart } from '@/mocks/inventoryPartMocks';
import { DEFAULT_SORTING_OPTION } from '@/pages/api/graphql/dataSources/constants';
import InventoryPartService from '@/pages/api/graphql/dataSources/InventoryPartService';
import { createInventoryPartFilterOptions, makeConnectionObject } from '@/pages/api/graphql/utils/utils';

jest.mock('@/pages/api/graphql/utils/utils', () => ({
  ...jest.requireActual('@/pages/api/graphql/utils/utils'),
  makeConnectionObject: jest.fn(),
  createInventoryPartFilterOptions: jest.fn(),
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
    const mockInventoryParts = [
      mockInventoryPart,
      {
        ...mockInventoryPart,
        id: 'test-inventory-part-id-2',
        message: 'test-message',
        priority: 'Out of Stock',
      },
    ];
    const mockTotalItems = 2;
    const mockConnection = {
      edges: [],
      pageInfo: {},
      totalCount: mockTotalItems,
    };

    beforeEach(() => {
      (createInventoryPartFilterOptions as jest.Mock).mockReturnValue(mockFilters);
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
});
