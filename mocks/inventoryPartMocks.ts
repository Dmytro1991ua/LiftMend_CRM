import { Decimal } from '@prisma/client/runtime/library';

export const mockInventoryPartId = 'test_inventory_part_id';

export const mockInventoryPart = {
  id: mockInventoryPartId,
  name: 'Door Sensor (Infrared)',
  stock: 5,
  minStock: 6,
  unitPrice: new Decimal(85),
  createdAt: new Date('2026-04-21T16:59:33.716Z'),
  status: 'Low Stock',
};

export const mockedReturnedInventoryPartsData = {
  getInventoryParts: {
    edges: [
      {
        cursor: mockInventoryPartId,
        node: { ...mockInventoryPart, __typename: 'InventoryPart' },
        __typename: 'InventoryPartEdge',
      },
    ],
    pageInfo: {
      hasNextPage: true,
      hasPreviousPage: false,
      startCursor: mockInventoryPartId,
      endCursor: mockInventoryPartId,
      __typename: 'PageInfo',
    },
    total: 1,
    __typename: 'InventoryPartConnection',
  },
};
