import { FetchResult } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { GraphQLError } from 'graphql';

import {
  CREATE_TECHNICIAN_RECORD,
  DELETE_TECHNICIAN_RECORD,
  GET_TECHNICIAN_RECORDS,
  GET_TECHNICIAN_RECORD_BY_ID,
  GET_TECHNICIAN_RECORD_FORM_DATA,
  UPDATE_TECHNICIAN_RECORD,
} from '@/graphql/schemas';
import {
  CreateTechnicianRecordMutation,
  DeleteTechnicianRecordMutation,
  GetTechnicianPerformanceMetricsQuery,
  GetTechnicianRecordByIdQuery,
  GetTechnicianRecordFormDataQuery,
  GetTechnicianRecordsQuery,
  UpdateTechnicianRecordMutation,
} from '@/graphql/types/client/generated_types';

import { GET_TECHNICIAN_PERFORMANCE_METRICS } from './../graphql/schemas/getTechnicianPerfomanceMetrics';

export const mockTechnicianContactInfo = 'benjamin.hall@example.com';
export const mockTechnicianSkills = ['Electrical', 'Mechanical', 'Troubleshooting'];
export const mockTechnicianCertifications = ['Certified Elevator Technician', 'First Aid Certification'];
export const mockAvailableTechnicianStatuses = ['Active', 'Inactive'];
export const mockBenjaminHallRecordId = 'test-technician-id-1';
export const mockOliviaLewisRecordId = 'test-technician-id-2';
export const mockJamesAndersonRecordId = 'test-technician-id-3';

export const mockBenjaminHallRecord = {
  id: mockBenjaminHallRecordId,
  name: 'Benjamin Hall',
  contactInformation: mockTechnicianContactInfo,
  skills: mockTechnicianSkills,
  certifications: mockTechnicianCertifications,
  availabilityStatus: 'Available',
  employmentStatus: 'Active',
  lastKnownAvailabilityStatus: null,
};

export const mockOliviaLewisRecord = {
  id: mockOliviaLewisRecordId,
  name: 'Olivia Lewis',
  contactInformation: 'olivia.lewis@example.com',
  skills: ['Blueprint Reading', 'Installation', 'Emergency Response'],
  certifications: ['Confined Space Entry Certification', 'Fall Protection Certification'],
  availabilityStatus: 'Available',
  employmentStatus: 'Active',
  lastKnownAvailabilityStatus: null,
};

export const mockJamesAndersonRecord = {
  id: mockJamesAndersonRecordId,
  name: 'James Anderson',
  contactInformation: 'james.anderson@example.com',
  skills: ['Hydraulic', 'Repair', 'Routine Maintenance'],
  certifications: ['Electrical Work License', 'Safety Management Certification'],
  availabilityStatus: 'Available',
  employmentStatus: 'Active',
  lastKnownAvailabilityStatus: null,
};

export const mockUpdatedBenjaminHallRecord = {
  ...mockBenjaminHallRecord,
  employmentStatus: 'Inactive',
  availabilityStatus: 'Unavailable',
  lastKnownAvailabilityStatus: 'Available',
};

export const mockBenjaminHallPerformanceMetrics = {
  totalRepairJobs: 3,
  completedRepairJobs: 1,
  activeRepairJobs: 1,
  overdueRepairJobs: 1,
  averageDurationDays: 61.6,
  onTimeCompletionRate: 0,
};

export const mockedReturnedTechnicianRecordsData = {
  getTechnicianRecords: {
    edges: [
      {
        cursor: mockBenjaminHallRecordId,
        node: { ...mockBenjaminHallRecord, __typename: 'TechnicianRecord' },
        __typename: 'TechnicianRecordEdges',
      },
      {
        cursor: mockOliviaLewisRecordId,
        node: { ...mockOliviaLewisRecord, __typename: 'TechnicianRecord' },
        __typename: 'TechnicianRecordEdges',
      },
    ],
    pageInfo: {
      hasNextPage: true,
      hasPreviousPage: false,
      startCursor: mockBenjaminHallRecordId,
      endCursor: mockOliviaLewisRecordId,
      __typename: 'PageInfo',
    },
    total: 2,
    __typename: 'TechnicianRecordConnection',
  },
};

export const mockTechnicianRecordsResponse: FetchResult<GetTechnicianRecordsQuery> = {
  data: { ...(mockedReturnedTechnicianRecordsData as GetTechnicianRecordsQuery) },
};

export const mockTechnicianRecordsPaginatedResponse: FetchResult<GetTechnicianRecordsQuery> = {
  data: {
    getTechnicianRecords: {
      edges: [
        {
          cursor: mockJamesAndersonRecordId,
          node: { ...mockJamesAndersonRecord, __typename: 'TechnicianRecord' },
          __typename: 'TechnicianRecordEdges',
        },
      ],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: true,
        startCursor: mockOliviaLewisRecordId,
        endCursor: mockJamesAndersonRecordId,
        __typename: 'PageInfo',
      },
      total: 1,
      __typename: 'TechnicianRecordConnection',
    },
  },
};

export const mockTechnicianRecordsFormData: MockedResponse<GetTechnicianRecordFormDataQuery> = {
  request: {
    query: GET_TECHNICIAN_RECORD_FORM_DATA,
  },
  result: {
    data: {
      getTechnicianRecordFormData: {
        employmentStatuses: mockAvailableTechnicianStatuses,
        availabilityStatuses: mockAvailableTechnicianStatuses,
        skills: mockTechnicianSkills,
        certifications: mockTechnicianCertifications,
        __typename: 'TechnicianRecordFormData',
      },
    },
  },
};

export const mockTechnicianRecords: MockedResponse<GetTechnicianRecordsQuery> = {
  request: {
    query: GET_TECHNICIAN_RECORDS,
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
    ...mockTechnicianRecordsResponse,
  },
};

export const mockPaginatedTechnicianRecords: MockedResponse<GetTechnicianRecordsQuery>[] = [
  mockTechnicianRecords,
  {
    request: {
      query: GET_TECHNICIAN_RECORDS,
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
      ...mockTechnicianRecordsPaginatedResponse,
    },
  },
];

export const mockTechnicianRecordById: MockedResponse<GetTechnicianRecordByIdQuery> = {
  request: {
    query: GET_TECHNICIAN_RECORD_BY_ID,
    variables: {
      id: mockBenjaminHallRecordId,
    },
  },
  result: {
    data: {
      getTechnicianRecordById: { ...mockBenjaminHallRecord, __typename: 'TechnicianRecord' },
    },
  },
};

export const mockTechnicianRecordByIdError: MockedResponse<GetTechnicianRecordByIdQuery> = {
  request: {
    query: GET_TECHNICIAN_RECORD_BY_ID,
    variables: { id: 'test-id-error' },
  },
  error: new Error('Something went wrong!'),
};

export const mockCreateNewTechnicianRecordResponse: MockedResponse<CreateTechnicianRecordMutation> = {
  request: {
    query: CREATE_TECHNICIAN_RECORD,
    variables: {
      input: mockOliviaLewisRecord,
    },
  },
  result: {
    data: {
      createTechnicianRecord: { ...mockOliviaLewisRecord, __typename: 'TechnicianRecord' },
    },
  },
};

export const mockCreateNewTechnicianRecordGQLErrorResponse: MockedResponse<CreateTechnicianRecordMutation> = {
  request: {
    query: CREATE_TECHNICIAN_RECORD,
    variables: {
      input: mockOliviaLewisRecord,
    },
  },
  result: {
    data: undefined,
    errors: [new GraphQLError('Test GQL error')],
  },
};

export const mockCreateNewTechnicianRecordNetworkErrorResponse = {
  request: {
    query: CREATE_TECHNICIAN_RECORD,
    variables: {
      input: mockOliviaLewisRecord,
    },
  },
  result: {
    data: undefined,
    error: new Error('Network Error occurs'),
  },
};

export const mockUpdateTechnicianRecord: MockedResponse<UpdateTechnicianRecordMutation> = {
  request: {
    query: UPDATE_TECHNICIAN_RECORD,
    variables: {
      input: {
        id: mockBenjaminHallRecordId,
        employmentStatus: 'Inactive',
        availabilityStatus: 'Unavailable',
        lastKnownAvailabilityStatus: 'Available',
      },
    },
  },
  result: {
    data: {
      updateTechnicianRecord: {
        ...mockUpdatedBenjaminHallRecord,
        __typename: 'TechnicianRecord',
      },
    },
    errors: [],
  },
};

export const mockUpdateTechnicianRecordGQLError: MockedResponse<UpdateTechnicianRecordMutation> = {
  request: {
    query: UPDATE_TECHNICIAN_RECORD,
    variables: {
      input: {
        id: mockBenjaminHallRecordId,
        employmentStatus: 'Inactive',
        availabilityStatus: 'Unavailable',
        lastKnownAvailabilityStatus: 'Available',
      },
    },
  },
  result: {
    data: undefined,
    errors: [new GraphQLError('Test error')],
  },
};

export const mockUpdateTechnicianRecordNetworkError = {
  request: {
    query: UPDATE_TECHNICIAN_RECORD,
    variables: {
      input: {
        id: mockBenjaminHallRecordId,
        employmentStatus: 'Inactive',
        availabilityStatus: 'Unavailable',
        lastKnownAvailabilityStatus: 'Available',
      },
    },
  },
  result: {
    data: undefined,
    error: new Error('Error occurs'),
  },
};

export const mockDeleteTechnicianRecord: MockedResponse<DeleteTechnicianRecordMutation> = {
  request: {
    query: DELETE_TECHNICIAN_RECORD,
    variables: {
      id: mockBenjaminHallRecordId,
    },
  },
  result: {
    data: {
      deleteTechnicianRecord: {
        id: mockBenjaminHallRecordId,
        __typename: 'DeleteTechnicianRecordResponse',
      },
    },
    errors: [],
  },
};

export const mockDeleteTechnicianRecordGQLError = {
  request: {
    query: DELETE_TECHNICIAN_RECORD,
    variables: {
      id: mockBenjaminHallRecordId,
    },
  },
  result: {
    data: undefined,
    errors: [new GraphQLError('Test error')],
  },
};

export const mockDeleteTechnicianRecordNetworkError = {
  request: {
    query: DELETE_TECHNICIAN_RECORD,
    variables: {
      id: 'test-id-1',
    },
  },
  result: {
    data: undefined,
    error: new Error('Error occurs'),
  },
};

export const mockTechnicianPerformanceMetricsResponse: MockedResponse<GetTechnicianPerformanceMetricsQuery> = {
  request: {
    query: GET_TECHNICIAN_PERFORMANCE_METRICS,
    variables: {
      technicianName: mockBenjaminHallRecord.name,
    },
  },
  result: {
    data: {
      getTechnicianPerformance: { ...mockBenjaminHallPerformanceMetrics, __typename: 'TechnicianPerformanceMetrics' },
    },
  },
};

export const mockTechnicianPerformanceMetricsErrorResponse = {
  request: {
    query: GET_TECHNICIAN_PERFORMANCE_METRICS,
    variables: {
      technicianName: mockBenjaminHallRecord.name,
    },
  },
  error: new Error('Something went wrong'),
};
