import { FetchResult } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';

import { GET_INVENTORY_PARTS } from '@/graphql/schemas/getInventoryParts';
import { GetInventoryPartsQuery } from '@/graphql/types/client/generated_types';

export const mockDoorSensorInventoryPartId = 'test_inventory_part_id';
export const mockRubberBufferInventoryPartId = 'test_inventory_part_id_2';

export const mockDoorSensorInventoryPart = {
  id: mockDoorSensorInventoryPartId,
  name: 'Door Sensor (Infrared)',
  stock: 5,
  minStock: 6,
  unitPrice: '85',
  createdAt: new Date('2026-04-21T16:59:33.716Z'),
  status: 'Low Stock',
};

export const mockRubberBufferInventoryPart = {
  id: mockRubberBufferInventoryPartId,
  name: 'Rubber Buffer',
  stock: 3,
  minStock: 4,
  unitPrice: '130',
  createdAt: new Date('2026-04-21T16:59:33.716Z'),
  status: 'Low Stock',
};

export const mockedReturnedInventoryPartsData = {
  getInventoryParts: {
    edges: [
      {
        cursor: mockDoorSensorInventoryPartId,
        node: { ...mockDoorSensorInventoryPart, __typename: 'InventoryPart' },
        __typename: 'InventoryPartEdge',
      },
    ],
    pageInfo: {
      hasNextPage: true,
      hasPreviousPage: false,
      startCursor: mockDoorSensorInventoryPartId,
      endCursor: mockDoorSensorInventoryPartId,
      __typename: 'PageInfo',
    },
    total: 1,
    __typename: 'InventoryPartConnection',
  },
};

export const mockInventoryPartsResponse: FetchResult<GetInventoryPartsQuery> = {
  data: { ...(mockedReturnedInventoryPartsData as GetInventoryPartsQuery) },
};

export const mockedReturnedInventoryPartsPaginatedResponse: FetchResult<GetInventoryPartsQuery> = {
  data: {
    getInventoryParts: {
      edges: [
        {
          cursor: mockRubberBufferInventoryPartId,
          node: { ...mockRubberBufferInventoryPart, __typename: 'InventoryPart' },
          __typename: 'InventoryPartEdge',
        },
      ],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: true,
        startCursor: mockRubberBufferInventoryPartId,
        endCursor: mockRubberBufferInventoryPartId,
        __typename: 'PageInfo',
      },
      total: 1,
      __typename: 'InventoryPartConnection',
    },
  },
};

export const mockInventoryParts: MockedResponse<GetInventoryPartsQuery> = {
  request: {
    query: GET_INVENTORY_PARTS,
    variables: {
      paginationOptions: {
        limit: 20,
        offset: 0,
      },
      sortOptions: {
        field: null,
        order: null,
      },
      filterOptions: {
        searchTerm: '',
      },
    },
  },
  result: {
    ...mockInventoryPartsResponse,
  },
};

export const mockPaginatedInventoryParts: MockedResponse<GetInventoryPartsQuery>[] = [
  mockInventoryParts,
  {
    request: {
      query: GET_INVENTORY_PARTS,
      variables: {
        paginationOptions: {
          limit: 20,
          offset: 1,
        },
        sortOptions: {
          field: null,
          order: null,
        },
        filterOptions: {
          searchTerm: '',
        },
      },
    },
    result: {
      ...mockedReturnedInventoryPartsPaginatedResponse,
    },
  },
];
