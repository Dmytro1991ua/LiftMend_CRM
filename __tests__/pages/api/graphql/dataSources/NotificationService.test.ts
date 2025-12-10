import { QueryGetNotificationsArgs } from '@/graphql/types/server/generated_types';
import { notificationServicePrismaMock } from '@/mocks/gql/prismaMocks';
import { mockNotification, mockNotificationId } from '@/mocks/notificationMocks';
import { DEFAULT_SORTING_OPTION } from '@/pages/api/graphql/dataSources/constants';
import NotificationService from '@/pages/api/graphql/dataSources/NotificationService';
import { createNotificationFilterOptions, makeConnectionObject } from '@/pages/api/graphql/utils/utils';

jest.mock('@/pages/api/graphql/utils/utils', () => ({
  ...jest.requireActual('@/pages/api/graphql/utils/utils'),
  makeConnectionObject: jest.fn(),
  createNotificationFilterOptions: jest.fn(),
}));

describe('NotificationService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const notificationService = new NotificationService(notificationServicePrismaMock);

  describe('notifications', () => {
    const mockArgs = {
      paginationOptions: { offset: 5, limit: 10 },
      filterOptions: { status: 'Urgent' },
    } as unknown as QueryGetNotificationsArgs;

    const mockFilters = { status: 'Urgent' };
    const mockOrderBy = { createdAt: DEFAULT_SORTING_OPTION };
    const mockNotifications = [
      mockNotification,
      {
        ...mockNotification,
        id: 'test-notification-id-2',
        message: 'test-message',
        priority: 'Hight',
      },
    ];
    const mockTotalItems = 2;
    const mockConnection = {
      edges: [],
      pageInfo: {},
      totalCount: mockTotalItems,
    };

    beforeEach(() => {
      (createNotificationFilterOptions as jest.Mock).mockReturnValue(mockFilters);
      (makeConnectionObject as jest.Mock).mockReturnValue(mockConnection);
    });

    it('should fetch notifications with correct prisma calls and return connection object', async () => {
      (notificationServicePrismaMock.notification.findMany as jest.Mock).mockResolvedValue(mockNotifications);
      (notificationServicePrismaMock.notification.count as jest.Mock).mockResolvedValue(mockTotalItems);

      const result = await notificationService.notifications(mockArgs);

      expect(notificationServicePrismaMock.notification.findMany).toHaveBeenCalledWith({
        where: mockFilters,
        orderBy: mockOrderBy,
        skip: 5,
        take: 10,
      });

      expect(notificationServicePrismaMock.notification.count).toHaveBeenCalledWith({
        where: mockFilters,
      });

      expect(makeConnectionObject).toHaveBeenCalledWith({
        items: mockNotifications,
        totalItems: mockTotalItems,
        paginationOptions: mockArgs.paginationOptions,
        getCursor: expect.any(Function),
      });

      expect(result).toEqual(mockConnection);
    });
  });

  describe('unreadNotificationsCount', () => {
    it('should return correct count of unread notifications', async () => {
      const mockTotalItems = 1;

      (notificationServicePrismaMock.notification.count as jest.Mock).mockResolvedValue(mockTotalItems);

      const result = await notificationService.unreadNotificationsCount();

      expect(notificationServicePrismaMock.notification.count).toHaveBeenCalledWith({ where: { status: 'Unread' } });
      expect(result).toEqual(mockTotalItems);
    });
  });

  describe('markAsRead', () => {
    it('should mark a specific notification as marked', async () => {
      const mockResult = { ...mockNotification, status: 'Read', readAt: new Date() };

      (notificationServicePrismaMock.notification.update as jest.Mock).mockResolvedValue(mockResult);

      const result = await notificationService.markAsRead(mockNotificationId);

      expect(notificationServicePrismaMock.notification.update).toHaveBeenCalledWith({
        where: { id: mockNotificationId },
        data: {
          status: 'Read',
          readAt: expect.any(Date),
        },
      });

      expect(result).toEqual(mockResult);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all unread notifications as read and returns their IDs', async () => {
      const unread = [{ id: '1' }, { id: '2' }];

      (notificationServicePrismaMock.notification.findMany as jest.Mock).mockResolvedValue(unread);
      (notificationServicePrismaMock.notification.update as jest.Mock)
        .mockResolvedValueOnce({ id: '1' })
        .mockResolvedValueOnce({ id: '2' });

      const result = await notificationService.markAllAsRead();

      expect(notificationServicePrismaMock.notification.findMany).toHaveBeenCalledWith({
        where: { status: 'Unread' },
        select: { id: true },
      });

      expect(notificationServicePrismaMock.notification.update).toHaveBeenCalledTimes(2);

      expect(result).toEqual({ updatedNotificationIds: ['1', '2'] });
    });

    it('should return empty array when no unread notifications', async () => {
      (notificationServicePrismaMock.notification.findMany as jest.Mock).mockResolvedValue([]);

      const result = await notificationService.markAllAsRead();

      expect(notificationServicePrismaMock.notification.findMany).toHaveBeenCalled();
      expect(notificationServicePrismaMock.notification.update).not.toHaveBeenCalled();
      expect(result).toEqual({ updatedNotificationIds: [] });
    });
  });
});
