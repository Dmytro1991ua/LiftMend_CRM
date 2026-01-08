import { FetchResult } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';

import { GET_CHANGE_LOGS } from '@/graphql/schemas/getChangeLogs';
import { GetChangeLogsQuery } from '@/graphql/types/client/generated_types';

const mockSystemChangeLogId = 'test-system-change-log-id';
const mockUserChangeLogId = 'test-user-change-log-id';

export const mockSystemChangeLog = {
  modifiedBy: 'System',
  id: mockSystemChangeLogId,
  entityType: 'RepairJob',
  entityId: 'f00442c5-ab22-445d-af55-b8012bf5fe6e',
  changeList: [
    {
      field: 'isOverdue',
      oldValue: false,
      newValue: true,
      action: 'update',
      __typename: 'FieldChange',
    },
  ],
  createdAt: '2025-12-28T11:00:05.069Z',
  __typename: 'ChangeLog',
};

export const mockUserChangeLog = {
  modifiedBy: 'Alex Smith',
  id: mockUserChangeLogId,
  entityType: 'ElevatorRecord',
  entityId: 'cdd361e9-53b7-486a-a0a9-465a43787f64',
  changeList: [
    {
      field: 'status',
      oldValue: 'Operational',
      newValue: 'Under Maintenance',
      action: 'update',
      __typename: 'FieldChange',
    },
  ],
  createdAt: '2025-12-27T18:08:23.303Z',
  __typename: 'ChangeLog',
};

export const mockedReturnedChangeLogsData = {
  getChangeLogs: {
    edges: [
      {
        cursor: mockSystemChangeLogId,
        node: { ...mockSystemChangeLog, __typename: 'ChangeLog' },
        __typename: 'ChangeLogEdge',
      },
    ],
    pageInfo: {
      hasNextPage: true,
      hasPreviousPage: false,
      startCursor: mockSystemChangeLogId,
      endCursor: mockSystemChangeLogId,
      __typename: 'PageInfo',
    },
    total: 1,
    __typename: 'ChangeLogConnection',
  },
};

export const mockPaginatedChangeLogData = {
  getChangeLogs: {
    edges: [
      {
        cursor: mockUserChangeLogId,
        node: { ...mockUserChangeLog, __typename: 'ChangeLog' },
        __typename: 'ChangeLogEdge',
      },
    ],
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: true,
      startCursor: mockUserChangeLogId,
      endCursor: mockUserChangeLogId,
      __typename: 'PageInfo',
    },
    total: 1,
    __typename: 'ChangeLogConnection',
  },
};

export const mockChangeLogResponse: FetchResult<GetChangeLogsQuery> = {
  data: { ...(mockedReturnedChangeLogsData as GetChangeLogsQuery) },
};

export const mockPaginatedChangeLogResponse: FetchResult<GetChangeLogsQuery> = {
  data: { ...(mockPaginatedChangeLogData as GetChangeLogsQuery) },
};

export const mockChangeLogs: MockedResponse<GetChangeLogsQuery> = {
  request: {
    query: GET_CHANGE_LOGS,
    variables: {
      paginationOptions: {
        limit: 20,
        offset: 0,
      },
      filterOptions: {},
    },
  },
  result: {
    ...mockChangeLogResponse,
  },
};

export const mockPaginatedChangeLogs: MockedResponse<GetChangeLogsQuery>[] = [
  mockChangeLogs,
  {
    request: {
      query: GET_CHANGE_LOGS,
      variables: {
        paginationOptions: {
          limit: 20,
          offset: 1,
        },
        filterOptions: {},
      },
    },
    result: {
      ...mockPaginatedChangeLogResponse,
    },
  },
];
