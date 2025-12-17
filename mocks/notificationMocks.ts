import { FetchResult } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { GraphQLError } from 'graphql';

import { GET_NOTIFICATIONS } from '@/graphql/schemas/getNotifications';
import { GET_UNREAD_NOTIFICATIONS_COUNT } from '@/graphql/schemas/getUnreadNotificationCount';
import { MARK_NOTIFICATION_AS_READ } from '@/graphql/schemas/markNotificationAsRead';
import {
  GetNotificationsQuery,
  GetUnreadNotificationsCountQuery,
  MarkNotificationAsReadMutation,
} from '@/graphql/types/client/generated_types';

export const mockUpcomingNotificationId = 'test-notification-id-1';
export const mockUrgentNotificationId = 'test-notification-id-2';
export const mockUnreadNotificationsCount = 2;

export const mockUpcomingNotification = {
  id: mockUpcomingNotificationId,
  userId: null,
  category: 'Upcoming',
  relatedEntityId: '5121c978-c4a2-4e65-be09-676724ea16de',
  message:
    'Upcoming Repair Job for Glass Elevator at Greenfield Hospital (Fitness Center) scheduled for tomorrow. Technician: Michael Brown.',
  priority: 'Medium',
  status: 'Unread',
  createdAt: '2025-12-10T09:00:02.535Z',
  readAt: null,
};

export const mockUrgentNotification = {
  id: mockUrgentNotificationId,
  userId: null,
  category: 'Urgent',
  relatedEntityId: 'test-id-1',
  message: 'Test Urgent Message',
  priority: 'Hight',
  status: 'Unread',
  createdAt: '2025-10-10T19:00:02.535Z',
  readAt: null,
};

export const mockedReturnedNotificationsData = {
  getNotifications: {
    edges: [
      {
        cursor: mockUpcomingNotificationId,
        node: { ...mockUpcomingNotification, __typename: 'Notification' },
        __typename: 'NotificationEdge',
      },
    ],
    pageInfo: {
      hasNextPage: true,
      hasPreviousPage: false,
      startCursor: mockUpcomingNotificationId,
      endCursor: mockUpcomingNotificationId,
      __typename: 'PageInfo',
    },
    total: 1,
    __typename: 'NotificationConnection',
  },
};

export const mockNotificationsPaginatedResponse: FetchResult<GetNotificationsQuery> = {
  data: {
    getNotifications: {
      edges: [
        {
          cursor: mockUrgentNotificationId,
          node: { ...mockUrgentNotification, __typename: 'Notification' },
          __typename: 'NotificationEdge',
        },
      ],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: true,
        startCursor: mockUpcomingNotificationId,
        endCursor: mockUrgentNotificationId,
        __typename: 'PageInfo',
      },
      total: 1,
      __typename: 'NotificationConnection',
    },
  },
};

export const mockNotificationsResponse: FetchResult<GetNotificationsQuery> = {
  data: { ...(mockedReturnedNotificationsData as GetNotificationsQuery) },
};

export const mockUnreadNotificationsCountResponse: MockedResponse<GetUnreadNotificationsCountQuery> = {
  request: {
    query: GET_UNREAD_NOTIFICATIONS_COUNT,
  },
  result: {
    data: {
      getUnreadNotificationCount: mockUnreadNotificationsCount,
    },
    errors: [],
  },
};

export const mockNotifications: MockedResponse<GetNotificationsQuery> = {
  request: {
    query: GET_NOTIFICATIONS,
    variables: {
      paginationOptions: {
        limit: 20,
        offset: 0,
      },
    },
  },
  result: {
    ...mockNotificationsResponse,
  },
};

export const mockPaginatedNotifications: MockedResponse<GetNotificationsQuery>[] = [
  mockNotifications,
  {
    request: {
      query: GET_NOTIFICATIONS,
      variables: {
        paginationOptions: {
          limit: 20,
          offset: 1,
        },
      },
    },
    result: {
      ...mockNotificationsPaginatedResponse,
    },
  },
];

export const mockMarkNotificationAsReadResponse: MockedResponse<MarkNotificationAsReadMutation> = {
  request: {
    query: MARK_NOTIFICATION_AS_READ,
    variables: {
      input: {
        id: mockUrgentNotification.id,
      },
    },
  },
  result: {
    data: {
      markNotificationAsRead: {
        ...mockUrgentNotification,
        status: 'Read',
        __typename: 'Notification',
      },
    },
    errors: [],
  },
};

export const mockMarkNotificationAsReadGQLErrorResponse: MockedResponse<MarkNotificationAsReadMutation> = {
  request: {
    query: MARK_NOTIFICATION_AS_READ,
    variables: {
      input: {
        id: mockUrgentNotification.id,
      },
    },
  },
  result: {
    data: undefined,
    errors: [new GraphQLError('Test error')],
  },
};

export const mockMarkNotificationAsReadNetworkErrorResponse = {
  request: {
    query: MARK_NOTIFICATION_AS_READ,
    variables: {
      input: {
        id: mockUrgentNotification.id,
      },
    },
  },
  result: {
    data: undefined,
    error: new Error('Error occurs'),
  },
};
