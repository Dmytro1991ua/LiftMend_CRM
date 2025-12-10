export const mockNotificationId = 'test-notification-id-1';

export const mockNotification = {
  id: mockNotificationId,
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

export const mockedReturnedNotificationsData = {
  getNotifications: {
    edges: [
      {
        cursor: mockNotificationId,
        node: { ...mockNotification, __typename: 'Notification' },
        __typename: 'NotificationEdge',
      },
    ],
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: mockNotificationId,
      endCursor: mockNotificationId,
      __typename: 'PageInfo',
    },
    total: 2,
    __typename: 'NotificationConnection',
  },
};
