import { FetchResult } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';

import { GET_REPAIR_JOBS } from '@/graphql/schemas';
import { GetRepairJobsQuery } from '@/graphql/types/client/generated_types';

export const mockRepairJob = {
  status: 'Scheduled',
  id: '1bcc2a00-5296-475f-af08-5cada100d509',
  jobType: 'Routine',
  jobDetails: 'asdasdasdasd',
  jobPriority: 'Low',
  elevatorType: 'Passenger Elevator',
  buildingName: 'Crystal Ridge Towers',
  elevatorLocation: 'Lobby',
  technicianName: 'Sophia Martinez',
  startDate: '2025-01-18T22:00:00.000Z',
  endDate: '2025-01-20T21:59:59.999Z',
  calendarEventId: '35c674d5-cf50-4153-b505-1e33696a1fdd',
  actualEndDate: new Date('2025-01-19T11:17:48.591Z'),
  isOverdue: false,
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
    id: '1bcc2a00-5296-475f-af08-5cada100d509',
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
    id: '3eddc560-b0e8-473d-a712-9e1d96b2184f',
    jobType: 'Upgrade',
    jobDetails: 'asdasdasdasd',
    jobPriority: 'Medium',
    elevatorType: 'Mast Lift',
    buildingName: 'Cedar Ridge Apartments',
    elevatorLocation: 'Warehouse Level',
    technicianName: 'Chloe Carter',
    startDate: '2025-01-18T22:00:00.000Z',
    endDate: '2025-01-20T21:59:59.999Z',
    calendarEventId: 'test-event-id-2',
    actualEndDate: '2025-01-19T11:16:41.472Z',
    isOverdue: false,
  },
};

export const mockRepairJobsResponse: FetchResult<GetRepairJobsQuery> = {
  data: {
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
