import { Prisma } from '@prisma/client';

import { CreateNotificationsForEntitiesParams } from './types';

/**
 * Creates notifications in bulk for a list of entities based on a set of rules.
 *
 * How it works:
 * 1. Fetches all existing unread notifications once (avoids N+1 queries)
 * 2. Builds a lookup key per notification (category + entityId) to check duplicates in memory
 * 3. Collects only new notifications that don't already exist
 * 4. Inserts them all in a single DB call
 *
 * @returns The number of notifications created
 */
export const createNotificationsForEntities = async <T extends { id: string }, C = void>({
  prisma,
  entities,
  rules,
  context,
  userId = null,
}: CreateNotificationsForEntitiesParams<T, C>): Promise<number> => {
  const unreadNotifications = await prisma.notification.findMany({
    where: { status: 'Unread' },
    select: { relatedEntityId: true, category: true },
  });

  // Build a Set of "category::entityId" keys for O(1) duplicate lookup
  const notificationLookup = new Set(unreadNotifications.map((n) => `${n.category}::${n.relatedEntityId}`));

  // For each entity, evaluate every rule and collect notifications that should be created
  const newNotifications = entities.reduce<Prisma.NotificationCreateManyInput[]>((acc, entity) => {
    Object.entries(rules).forEach(([category, rule]) => {
      const shouldCreateNotification = rule.condition(entity, context);
      const isNotificationDuplicate = notificationLookup.has(`${category}::${entity.id}`);

      if (!shouldCreateNotification || isNotificationDuplicate) return;

      acc.push({
        relatedEntityId: entity.id,
        category,
        message: rule.message(entity),
        priority: rule.priority,
        userId,
        status: 'Unread',
        readAt: null,
      });
    });
    return acc;
  }, []);

  if (newNotifications.length) {
    await prisma.notification.createMany({ data: newNotifications });
  }

  return newNotifications.length;
};
