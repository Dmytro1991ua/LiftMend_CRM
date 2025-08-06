import { FetchResult } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { GraphQLError } from 'graphql';

import {
  DELETE_REPAIR_JOB_AND_EVENT,
  GET_AVAILABLE_TECHNICIANS_FOR_ASSIGNMENT,
  GET_REPAIR_JOBS,
  GET_REPAIR_JOB_BY_ID,
  GET_REPAIR_JOB_FORM_DATA,
  REASSIGN_TECHNICIAN,
  UPDATE_REPAIR_JOB,
} from '@/graphql/schemas';
import {
  DeleteRepairJobAndEventMutation,
  GetAvailableTechniciansForAssignmentQuery,
  GetRepairJobByIdQuery,
  GetRepairJobsQuery,
  ReassignTechnicianMutation,
  UpdateRepairJobMutation,
} from '@/graphql/types/client/generated_types';

export const mockRepairJobId = '1bcc2a00-5296-475f-af08-5cada100d509';
export const mockCalendarEventId = '35c674d5-cf50-4153-b505-1e33696a1fdd';

export const mockRepairJob = {
  status: 'Scheduled',
  id: mockRepairJobId,
  jobType: 'Routine',
  jobDetails: 'asdasdasdasd',
  jobPriority: 'Low',
  elevatorType: 'Passenger Elevator',
  buildingName: 'Crystal Ridge Towers',
  elevatorLocation: 'Lobby',
  technicianName: 'Sophia Martinez',
  startDate: '2025-01-18T22:00:00.000Z',
  endDate: '2025-01-20T21:59:59.999Z',
  calendarEventId: mockCalendarEventId,
  actualEndDate: new Date('2025-01-19T11:17:48.591Z'),
  isOverdue: false,
};

export const mockUpdatedRepairJob = {
  ...mockRepairJob,
  technicianName: 'Mike Smith',
};

export const mockAvailableTechnicians = [
  {
    id: '8b3e2f3e-d0ff-4040-9d3f-c37a8bccd658',
    name: 'Benjamin Hall',
    __typename: 'TechnicianRecord',
  },
];

export const mockWarningAlertMessage =
  'Reassigning Sophia Martinez will unassign them from current Routine repair job located at Crystal Ridge Towers, Lobby, if applicable. This could delay or interrupt their ongoing tasks. Ensure that this reassignment is necessary before proceeding with';

export const mockPassengerElevatorRepairJob = {
  cursor: 'test-repair-job-id-1',
  node: {
    status: 'Scheduled',
    id: 'test-repair-job-id-1',
    jobType: 'Routine',
    jobDetails: 'asdasdasdasd',
    jobPriority: 'Low',
    elevatorType: 'Passenger Elevator',
    buildingName: 'Crystal Ridge Towers',
    elevatorLocation: 'Lobby',
    technicianName: 'Sophia Martinez',
    startDate: '2025-01-18T22:00:00.000Z',
    endDate: '2025-01-20T21:59:59.999Z',
    calendarEventId: 'test-event-id-1',
    actualEndDate: '2025-01-19T11:17:48.591Z',
    isOverdue: false,
  },
};

export const mockMastLiftRepairJob = {
  cursor: 'test-repair-job-id-2',
  node: {
    status: 'Completed',
    id: 'test-repair-job-id-2',
    jobType: 'Upgrade',
    jobDetails: 'asdasdasdasd',
    jobPriority: 'Medium',
    elevatorType: 'Mast Lift',
    buildingName: 'Cedar Ridge Apartments',
    elevatorLocation: 'Warehouse Level',
    technicianName: 'Chloe Carter',
    startDate: '2025-01-22T22:00:00.000Z',
    endDate: '2025-01-24T21:59:59.999Z',
    calendarEventId: 'test-event-id-2',
    actualEndDate: '2025-01-28T11:16:41.472Z',
    isOverdue: false,
  },
};

export const mockShipElevatorRepairJpb = {
  cursor: 'test-repair-job-id-3',
  node: {
    status: 'In Progress',
    id: 'test-repair-job-id-3',
    jobType: 'Consultation',
    jobDetails: 'asdasdasdasdasda23qeqwdead',
    jobPriority: 'Medium',
    elevatorType: 'Ship Elevator',
    buildingName: 'Bayview Condominiums',
    elevatorLocation: 'Kitchen',
    technicianName: 'Alice Johnson',
    startDate: '2025-01-125T22:00:00.000Z',
    endDate: '2025-01-26T21:59:59.999Z',
    calendarEventId: 'test-event-id-3',
    actualEndDate: null,
    isOverdue: true,
  },
};

export const mockAvailableTechniciansForAssignment = [
  {
    id: '3f16eb24-26fd-44e3-939f-2ede19e89534',
    name: 'Charles Robinson',
  },
  {
    id: 'e2e34422-4335-40e2-a5f1-0d04baae3727',
    name: 'Chloe Carter',
  },
];

export const mockReturnedRepairJobsData = {
  getRepairJobs: {
    edges: [
      {
        cursor: mockPassengerElevatorRepairJob.cursor,
        node: { ...mockPassengerElevatorRepairJob.node, __typename: 'RepairJob' },
        __typename: 'RepairJobEdge',
      },
      {
        cursor: mockMastLiftRepairJob.cursor,
        node: { ...mockMastLiftRepairJob.node, __typename: 'RepairJob' },
        __typename: 'RepairJobEdge',
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
    __typename: 'RepairJobConnection',
  },
};

export const mockRepairJobsResponse: FetchResult<GetRepairJobsQuery> = {
  data: { ...(mockReturnedRepairJobsData as GetRepairJobsQuery) },
};

export const mockRepairJobsPaginatedResponse: FetchResult<GetRepairJobsQuery> = {
  data: {
    getRepairJobs: {
      edges: [
        {
          cursor: mockShipElevatorRepairJpb.cursor,
          node: { ...mockShipElevatorRepairJpb.node, __typename: 'RepairJob' },
          __typename: 'RepairJobEdge',
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
      __typename: 'RepairJobConnection',
    },
  },
};

export const mockRepairJobs: MockedResponse<GetRepairJobsQuery> = {
  request: {
    query: GET_REPAIR_JOBS,
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
    ...mockRepairJobsResponse,
  },
};

export const mockPaginatedRepairJobs: MockedResponse<GetRepairJobsQuery>[] = [
  mockRepairJobs,
  {
    request: {
      query: GET_REPAIR_JOBS,
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
      ...mockRepairJobsPaginatedResponse,
    },
  },
];

export const mockRepairJobsFormData: MockedResponse = {
  request: {
    query: GET_REPAIR_JOB_FORM_DATA,
  },
  result: {
    data: {
      getRepairJobScheduleData: {
        repairJobTypes: ['Compliance', 'Consultation', 'Emergency'],
        elevatorTypes: ['Auto-Elevator', 'Baggage Lift', 'Battery Powered Lift'],
        buildingNames: ['Bayview Condominiums', 'Beacon Heights Office Complex', 'Bluewater Hotel'],
        elevatorLocations: ['Art Gallery', 'Auditorium', 'Basement Garage'],
        technicianNames: ['Alice Johnson', 'Ava Young', 'Benjamin Hall'],
        technicianSkills: ['Blueprint Reading', 'Customer Service', 'Electrical'],
        priorities: ['High', 'Low', 'Medium'],
        statuses: ['Cancelled', 'Completed', 'In Progress', 'On Hold', 'Scheduled'],
        __typename: 'RepairJobScheduleData',
      },
    },
  },
};

export const mockRepairJobById: MockedResponse<GetRepairJobByIdQuery> = {
  request: {
    query: GET_REPAIR_JOB_BY_ID,
    variables: {
      id: mockRepairJobId,
    },
  },
  result: {
    data: {
      getRepairJobById: { ...mockRepairJob, __typename: 'RepairJob' },
    },
  },
};

export const mockRepairJobByIdError: MockedResponse<GetRepairJobByIdQuery> = {
  request: {
    query: GET_REPAIR_JOB_BY_ID,
    variables: { id: 'test-id-error' },
  },
  error: new Error('Something went wrong!'),
};

export const mockReassignTechnician: MockedResponse<ReassignTechnicianMutation> = {
  request: {
    query: REASSIGN_TECHNICIAN,
    variables: {
      input: {
        id: mockRepairJob.id,
        technicianName: 'Mike Smith',
      },
    },
  },
  result: {
    data: {
      reassignTechnician: {
        ...mockRepairJob,
        technicianName: 'Mike Smith',
        __typename: 'RepairJob',
      },
    },
    errors: [],
  },
};

export const mockReassignTechnicianGQLError = {
  request: {
    query: REASSIGN_TECHNICIAN,
    variables: {
      input: {
        id: mockRepairJob.id,
        technicianName: 'Mike Smith',
      },
    },
  },
  result: {
    data: undefined,
    errors: [new GraphQLError('Test error')],
  },
};

export const mockReassignTechnicianNetworkError = {
  request: {
    query: REASSIGN_TECHNICIAN,
    variables: {
      input: {
        id: mockRepairJob.id,
        technicianName: 'Mike Smith',
      },
    },
  },
  result: {
    data: undefined,
    error: new Error('Error occurs'),
  },
};

export const mockUpdateRepairJob: MockedResponse<UpdateRepairJobMutation> = {
  request: {
    query: UPDATE_REPAIR_JOB,
    variables: {
      input: {
        id: mockRepairJob.id,
        technicianName: mockRepairJob.technicianName,
        jobDetails: 'Test description',
      },
    },
  },
  result: {
    data: {
      updateRepairJob: {
        ...mockRepairJob,
        jobDetails: 'Test description',
        __typename: 'RepairJob',
      },
    },
    errors: [],
  },
};

export const mockUpdateRepairJobGQLError = {
  request: {
    query: UPDATE_REPAIR_JOB,
    variables: {
      input: {
        id: mockRepairJobById,
        technicianName: mockRepairJob.technicianName,
        jobDetails: 'Test description',
      },
    },
  },
  result: {
    data: undefined,
    errors: [new GraphQLError('Test error')],
  },
};

export const mockUpdateRepairJobNetworkError = {
  request: {
    query: UPDATE_REPAIR_JOB,
    variables: {
      input: {
        id: mockRepairJobById,
        technicianName: mockRepairJob.technicianName,
        jobDetails: 'Test description',
      },
    },
  },
  result: {
    data: undefined,
    error: new Error('Error occurs'),
  },
};

export const mockDeleteRepairJobAndCalendarEvent: MockedResponse<DeleteRepairJobAndEventMutation> = {
  request: {
    query: DELETE_REPAIR_JOB_AND_EVENT,
    variables: {
      repairJobId: mockRepairJobId,
      calendarEventid: mockCalendarEventId,
    },
  },
  result: {
    data: {
      deleteRepairJobAndEvent: {
        deletedRepairJobId: mockRepairJobId,
        deletedEventId: mockCalendarEventId,
        __typename: 'DeleteCalendarAndRepairJobResponse',
      },
    },
    errors: [],
  },
};

export const mocDeleteRepairJobAndCalendarEventGQLError = {
  request: {
    query: DELETE_REPAIR_JOB_AND_EVENT,
    variables: {
      repairJobId: mockRepairJobId,
      calendarEventid: mockCalendarEventId,
    },
  },
  result: {
    data: undefined,
    errors: [new GraphQLError('Test error')],
  },
};

export const mocDeleteRepairJobAndCalendarEventNetworkError = {
  request: {
    query: DELETE_REPAIR_JOB_AND_EVENT,
    variables: {
      repairJobId: mockRepairJobId,
      calendarEventid: mockCalendarEventId,
    },
  },
  result: {
    data: undefined,
    error: new Error('Error occurs'),
  },
};

export const mockGetAvailableTechniciansForAssignmentResponse: MockedResponse<GetAvailableTechniciansForAssignmentQuery> =
  {
    request: {
      query: GET_AVAILABLE_TECHNICIANS_FOR_ASSIGNMENT,
    },
    result: {
      data: {
        getAvailableTechniciansForAssignment: mockAvailableTechniciansForAssignment.map((technician) => ({
          ...technician,
          __typename: 'TechnicianRecord',
        })),
      },
    },
  };

export const mockGetAvailableTechniciansForAssignmentErrorResponse: MockedResponse<GetAvailableTechniciansForAssignmentQuery> =
  {
    request: {
      query: GET_AVAILABLE_TECHNICIANS_FOR_ASSIGNMENT,
    },
    error: new Error('Something went wrong'),
  };
