import { FetchResult } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { GraphQLError } from 'graphql';

import {
  DELETE_ELEVATOR_RECORD,
  GET_ELEVATOR_RECORDS,
  GET_ELEVATOR_RECORD_BY_ID,
  GET_ELEVATOR_RECORD_FORM_DATA,
  UPDATE_ELEVATOR_RECORD,
} from '@/graphql/schemas';
import {
  DeleteElevatorRecordMutation,
  GetElevatorRecordByIdQuery,
  GetElevatorRecordsQuery,
  UpdateElevatorRecordMutation,
} from '@/graphql/types/client/generated_types';

export const mockElevatorRecord = {
  id: 'test_id',
  elevatorType: 'Scenic Elevator',
  buildingName: 'Skyline Plaza',
  elevatorLocation: 'Observation Deck',
  lastMaintenanceDate: new Date('2024-05-20T10:00:00.000Z'),
  nextMaintenanceDate: new Date('2024-08-30T16:00:00.000Z'),
  capacity: 5000,
  status: 'Operational',
  lastKnownStatus: null,
};

export const mockElevatorRecordsFormData: MockedResponse = {
  request: {
    query: GET_ELEVATOR_RECORD_FORM_DATA,
  },
  result: {
    data: {
      getElevatorRecordFormData: {
        elevatorTypes: ['Auto-Elevator', 'Baggage Lift', 'Glass Elevator'],
        buildingNames: ['Clearwater Towers', 'Coastal Heights', 'Crystal Bay Apartments', 'Silverhill Apartments'],
        elevatorLocations: ['Warehouse', 'Warehouse Level', 'Workshop', 'Penthouse'],
        elevatorStatuses: ['Operational', 'Out of Service', 'Paused', 'Under Maintenance'],
        __typename: 'ElevatorRecordFormData',
      },
    },
  },
};

export const mockGlassElevatorElevatorRecord = {
  cursor: 'test-id-1',
  node: {
    id: 'test-id-1',
    elevatorType: 'Glass Elevator',
    buildingName: 'Silverhill Apartments',
    elevatorLocation: 'Penthouse',
    lastMaintenanceDate: '2024-01-20T10:00:00.000Z',
    nextMaintenanceDate: '2024-03-10T13:00:00.000Z',
    capacity: 2000,
    status: 'Operational',
    lastKnownStatus: null,
  },
};

export const mockServiceElevatorElevatorRecord = {
  cursor: 'test-id-2',
  node: {
    id: 'test-id-2',
    elevatorType: 'Service Elevator',
    buildingName: 'Oceanview Condos',
    elevatorLocation: 'Sky Bridge',
    lastMaintenanceDate: '2024-04-05T10:00:00.000Z',
    nextMaintenanceDate: '2024-07-28T15:00:00.000Z',
    capacity: 3500,
    status: 'Operational',
    lastKnownStatus: null,
  },
};

export const mockWarehouseLiftElevatorRecord = {
  cursor: 'test-id-3',
  node: {
    id: 'test-id-3',
    elevatorType: 'Warehouse Lift',
    buildingName: 'Sunset Towers',
    elevatorLocation: 'Storage Room',
    lastMaintenanceDate: '2024-05-11T09:00:00.000Z',
    nextMaintenanceDate: '2024-07-12T12:00:00.000Z',
    capacity: 3000,
    status: 'Operational',
    lastKnownStatus: null,
  },
};

export const mockElevatorRecordsResponse: FetchResult<GetElevatorRecordsQuery> = {
  data: {
    getElevatorRecords: {
      edges: [
        {
          cursor: mockGlassElevatorElevatorRecord.cursor,
          node: { ...mockGlassElevatorElevatorRecord.node, __typename: 'ElevatorRecord' },
          __typename: 'ElevatorRecordEdge',
        },
        {
          cursor: mockServiceElevatorElevatorRecord.cursor,
          node: { ...mockServiceElevatorElevatorRecord.node, __typename: 'ElevatorRecord' },
          __typename: 'ElevatorRecordEdge',
        },
      ],
      pageInfo: {
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: 'test-id-1',
        endCursor: 'test-id-2',
        __typename: 'PageInfo',
      },
      total: 2,
      __typename: 'ElevatorRecordConnection',
    },
  },
};

export const mockElevatorRecordsPaginatedResponse: FetchResult<GetElevatorRecordsQuery> = {
  data: {
    getElevatorRecords: {
      edges: [
        {
          cursor: mockWarehouseLiftElevatorRecord.cursor,
          node: { ...mockWarehouseLiftElevatorRecord.node, __typename: 'ElevatorRecord' },
          __typename: 'ElevatorRecordEdge',
        },
      ],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: true,
        startCursor: 'test-id-2',
        endCursor: 'test-id-3',
        __typename: 'PageInfo',
      },
      total: 1,
      __typename: 'ElevatorRecordConnection',
    },
  },
};

export const mockElevatorRecords: MockedResponse<GetElevatorRecordsQuery> = {
  request: {
    query: GET_ELEVATOR_RECORDS,
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
    ...mockElevatorRecordsResponse,
  },
};

export const mockPaginatedElevatorRecords: MockedResponse<GetElevatorRecordsQuery>[] = [
  mockElevatorRecords,
  {
    request: {
      query: GET_ELEVATOR_RECORDS,
      variables: {
        paginationOptions: {
          limit: 20,
          offset: 2,
        },
        filterOptions: {
          searchTerm: '',
        },
      },
    },
    result: {
      ...mockElevatorRecordsPaginatedResponse,
    },
  },
];

export const mockElevatorRecordById: MockedResponse<GetElevatorRecordByIdQuery> = {
  request: {
    query: GET_ELEVATOR_RECORD_BY_ID,
    variables: {
      id: 'test-id-1',
    },
  },
  result: {
    data: {
      getElevatorRecordById: { ...mockGlassElevatorElevatorRecord.node, __typename: 'ElevatorRecord' },
    },
  },
};

export const mockElevatorRecordByIdError: MockedResponse<GetElevatorRecordByIdQuery> = {
  request: {
    query: GET_ELEVATOR_RECORD_BY_ID,
    variables: { id: 'test-id-error' },
  },
  error: new Error('Something went wrong!'),
};

export const mockUpdatedElevatorRecord = {
  id: 'test-id-1',
  elevatorType: 'Glass Elevator',
  buildingName: 'Silverhill Apartments',
  elevatorLocation: 'Penthouse',
  lastMaintenanceDate: '2023-01-01',
  nextMaintenanceDate: '2024-01-01',
  capacity: 1000,
  status: 'Out of Service',
  lastKnownStatus: 'Operational',
};

export const mockUpdateElevatorRecord: MockedResponse<UpdateElevatorRecordMutation> = {
  request: {
    query: UPDATE_ELEVATOR_RECORD,
    variables: {
      input: {
        id: 'test-id-1',
        status: 'Out of Service',
        lastKnownStatus: 'Operational',
      },
    },
  },
  result: {
    data: {
      updateElevatorRecord: {
        ...mockUpdatedElevatorRecord,
        __typename: 'ElevatorRecord',
      },
    },
    errors: [],
  },
};

export const mockUpdateElevatorRecordGQLError = {
  request: {
    query: UPDATE_ELEVATOR_RECORD,
    variables: {
      input: {
        id: 'test-id-1',
        status: 'Out of Service',
        lastKnownStatus: 'Operational',
      },
    },
  },
  result: {
    data: undefined,
    errors: [new GraphQLError('Test error')],
  },
};

export const mockUpdateElevatorRecordNetworkError = {
  request: {
    query: UPDATE_ELEVATOR_RECORD,
    variables: {
      input: {
        id: 'test-id-1',
        status: 'Out of Service',
        lastKnownStatus: 'Operational',
      },
    },
  },
  result: {
    data: undefined,
    error: new Error('Error occurs'),
  },
};

export const mockDeleteElevatorRecord: MockedResponse<DeleteElevatorRecordMutation> = {
  request: {
    query: DELETE_ELEVATOR_RECORD,
    variables: {
      id: 'test-id-1',
    },
  },
  result: {
    data: {
      deleteElevatorRecord: {
        id: 'test-id-1',
        __typename: 'DeleteElevatorRecordResponse',
      },
    },
    errors: [],
  },
};

export const mocDeleteElevatorRecordGQLError = {
  request: {
    query: DELETE_ELEVATOR_RECORD,
    variables: {
      id: 'test-id-1',
    },
  },
  result: {
    data: undefined,
    errors: [new GraphQLError('Test error')],
  },
};

export const mockDeleteElevatorRecordNetworkError = {
  request: {
    query: UPDATE_ELEVATOR_RECORD,
    variables: {
      id: 'test-id-1',
    },
  },
  result: {
    data: undefined,
    error: new Error('Error occurs'),
  },
};
