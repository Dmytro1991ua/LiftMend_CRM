import {
  GetElevatorRecordByIdQuery,
  GetElevatorRecordsQuery,
  UpdateElevatorRecordMutation,
} from '@/graphql/types/client/generated_types';
import {
  GET_ELEVATOR_RECORD_BY_ID,
  GET_ELEVATOR_RECORD_FORM_DATA,
  GET_ELEVATOR_RECORDS,
  UPDATE_ELEVATOR_RECORD,
} from '@/graphql/schemas';
import { MockedResponse } from '@apollo/client/testing';
import { GraphQLError } from 'graphql';

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
    data: {
      getElevatorRecords: {
        edges: [
          {
            ...mockGlassElevatorElevatorRecord,
          },
          {
            ...mockServiceElevatorElevatorRecord,
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
  },
};

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

const mockUpdatedElevatorRecord = {
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
