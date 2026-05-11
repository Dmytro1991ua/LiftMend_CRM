import { PrismaClient } from '@prisma/client';

export type NotificationPayload = {
  entityId: string;
  category: string;
  message: string;
  priority: string;
  userId?: string | null;
};

export type NotificationPriority = 'Medium' | 'High';

export type NotificationRule<T, C = void> = {
  priority: NotificationPriority;
  condition: (entity: T, context?: C) => boolean;
  message: (entity: T) => string;
};

export type CreateNotificationsForEntitiesParams<T extends { id: string }, C = void> = {
  prisma: PrismaClient;
  entities: T[];
  rules: Record<string, NotificationRule<T, C>>;
  context?: C;
  userId?: string | null;
};
