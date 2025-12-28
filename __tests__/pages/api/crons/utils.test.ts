import { notificationServicePrismaMock } from '@/mocks/gql/prismaMocks';
import { NotificationPayload } from '@/pages/api/crons/types';
import { createNotificationIfNotExists } from '@/pages/api/crons/utils';

jest.mock('@/prisma/db', () => notificationServicePrismaMock);

describe('createNotificationIfNotExists', () => {
  const mockPayload: NotificationPayload = {
    jobId: 'job-1',
    category: 'Urgent',
    message: 'Test message',
    priority: 'High',
    userId: 'user-1',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a notification if one does not exist', async () => {
    (notificationServicePrismaMock.notification.findFirst as jest.Mock).mockResolvedValue(null);

    await createNotificationIfNotExists(notificationServicePrismaMock, mockPayload);

    expect(notificationServicePrismaMock.notification.findFirst).toHaveBeenCalledWith({
      where: { relatedEntityId: mockPayload.jobId, category: mockPayload.category },
    });

    expect(notificationServicePrismaMock.notification.create).toHaveBeenCalledWith({
      data: {
        userId: mockPayload.userId,
        relatedEntityId: mockPayload.jobId,
        category: mockPayload.category,
        message: mockPayload.message,
        priority: mockPayload.priority,
        readAt: null,
        status: 'Unread',
      },
    });
  });

  it('should not create a notification if one already exists', async () => {
    (notificationServicePrismaMock.notification.findFirst as jest.Mock).mockResolvedValue({
      id: 'existing-notification',
      relatedEntityId: mockPayload.jobId,
      category: mockPayload.category,
    });

    await createNotificationIfNotExists(notificationServicePrismaMock, mockPayload);

    expect(notificationServicePrismaMock.notification.findFirst).toHaveBeenCalledWith({
      where: { relatedEntityId: mockPayload.jobId, category: mockPayload.category },
    });

    expect(notificationServicePrismaMock.notification.create).not.toHaveBeenCalled();
  });
});
