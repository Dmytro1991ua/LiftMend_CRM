import { notificationServicePrismaMock } from '@/mocks/gql/prismaMocks';
import { NotificationRule } from '@/pages/api/crons/types';
import { createNotificationsForEntities } from '@/pages/api/crons/utils';

type MockEntity = { id: string; stock: number; minStock: number };
type MockEntityWithContext = { id: string; startDate: Date };

jest.mock('@/prisma/db', () => notificationServicePrismaMock);

describe('createNotificationsForEntities', () => {
  const mockRules: Record<string, NotificationRule<MockEntity>> = {
    LowStock: {
      priority: 'Medium',
      condition: (entity) => entity.stock > 0 && entity.stock <= entity.minStock,
      message: (entity) => `Low stock for entity ${entity.id}`,
    },
    OutOfStock: {
      priority: 'High',
      condition: (entity) => entity.stock === 0,
      message: (entity) => `Out of stock for entity ${entity.id}`,
    },
  };

  const mockEntities: MockEntity[] = [
    { id: 'part-1', stock: 2, minStock: 5 },
    { id: 'part-2', stock: 0, minStock: 5 },
    { id: 'part-3', stock: 10, minStock: 5 },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create notifications for entities that meet rule conditions', async () => {
    (notificationServicePrismaMock.notification.findMany as jest.Mock).mockResolvedValue([]);
    (notificationServicePrismaMock.notification.createMany as jest.Mock).mockResolvedValue({ count: 2 });

    const createdCount = await createNotificationsForEntities({
      prisma: notificationServicePrismaMock,
      entities: mockEntities,
      rules: mockRules,
    });

    expect(notificationServicePrismaMock.notification.findMany).toHaveBeenCalledWith({
      where: { status: 'Unread' },
      select: { relatedEntityId: true, category: true },
    });

    expect(notificationServicePrismaMock.notification.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({
          relatedEntityId: 'part-1',
          category: 'LowStock',
          priority: 'Medium',
          status: 'Unread',
        }),
        expect.objectContaining({
          relatedEntityId: 'part-2',
          category: 'OutOfStock',
          priority: 'High',
          status: 'Unread',
        }),
      ]),
    });

    expect(createdCount).toBe(2);
  });

  it('should not create duplicate notifications for already existing unread notifications', async () => {
    (notificationServicePrismaMock.notification.findMany as jest.Mock).mockResolvedValue([
      { relatedEntityId: 'part-1', category: 'LowStock' },
    ]);
    (notificationServicePrismaMock.notification.createMany as jest.Mock).mockResolvedValue({ count: 1 });

    const createdCount = await createNotificationsForEntities({
      prisma: notificationServicePrismaMock,
      entities: mockEntities,
      rules: mockRules,
    });

    expect(notificationServicePrismaMock.notification.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([expect.objectContaining({ relatedEntityId: 'part-2', category: 'OutOfStock' })]),
    });

    expect(notificationServicePrismaMock.notification.createMany).toHaveBeenCalledWith({
      data: expect.not.arrayContaining([expect.objectContaining({ relatedEntityId: 'part-1', category: 'LowStock' })]),
    });

    expect(createdCount).toBe(1);
  });

  it('should not call createMany if no entities meet rule conditions', async () => {
    (notificationServicePrismaMock.notification.findMany as jest.Mock).mockResolvedValue([]);

    const entitiesWithNoViolations: MockEntity[] = [
      { id: 'part-1', stock: 10, minStock: 5 },
      { id: 'part-2', stock: 8, minStock: 5 },
    ];

    const createdCount = await createNotificationsForEntities({
      prisma: notificationServicePrismaMock,
      entities: entitiesWithNoViolations,
      rules: mockRules,
    });

    expect(notificationServicePrismaMock.notification.createMany).not.toHaveBeenCalled();
    expect(createdCount).toBe(0);
  });

  it('should pass context to condition when provided', async () => {
    const tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const matchingStartDate = new Date(tomorrow);

    const contextRules: Record<string, NotificationRule<MockEntityWithContext, Date>> = {
      Upcoming: {
        priority: 'Medium',
        condition: (entity, context) => (context ? entity.startDate.toDateString() === context.toDateString() : false),
        message: (entity) => `Upcoming event for ${entity.id}`,
      },
    };

    const contextEntities: MockEntityWithContext[] = [
      { id: 'job-1', startDate: matchingStartDate },
      { id: 'job-2', startDate: new Date() },
    ];

    (notificationServicePrismaMock.notification.findMany as jest.Mock).mockResolvedValue([]);
    (notificationServicePrismaMock.notification.createMany as jest.Mock).mockResolvedValue({ count: 1 });

    const createdCount = await createNotificationsForEntities<MockEntityWithContext, Date>({
      prisma: notificationServicePrismaMock,
      entities: contextEntities,
      rules: contextRules,
      context: tomorrow,
    });

    expect(notificationServicePrismaMock.notification.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([expect.objectContaining({ relatedEntityId: 'job-1', category: 'Upcoming' })]),
    });

    expect(notificationServicePrismaMock.notification.createMany).toHaveBeenCalledWith({
      data: expect.not.arrayContaining([expect.objectContaining({ relatedEntityId: 'job-2', category: 'Upcoming' })]),
    });

    expect(createdCount).toBe(1);
  });
});
