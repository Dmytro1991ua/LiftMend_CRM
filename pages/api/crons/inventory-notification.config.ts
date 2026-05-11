import { InventoryPart } from '@prisma/client';

export type InventoryPartNotificationPartPriority = 'Medium' | 'High';
export type InventoryPartNotificationPartCategory = 'Low Stock' | 'Out of Stock';
type InventoryPartNotificationPartMessage = (inventoryPart: InventoryPart) => string;
type InventoryPartNotificationPartCondition = (inventoryPart: InventoryPart) => boolean;

export type InventoryPartNotificationPartRule = {
  priority: InventoryPartNotificationPartPriority;
  condition: (part: InventoryPart) => boolean;
  message: (part: InventoryPart) => string;
};

export const INVENTORY_PART_NOTIFICATION_MESSAGE_CONFIG: Record<
  InventoryPartNotificationPartCategory,
  InventoryPartNotificationPartMessage
> = {
  'Low Stock': ({ name, stock }) => `${name} is running low on stock (${stock} remaining).`,
  'Out of Stock': ({ name }) => `${name} is out of stock.`,
};

export const INVENTORY_PART_NOTIFICATION_CONDITION_CONFIG: Record<
  InventoryPartNotificationPartCategory,
  InventoryPartNotificationPartCondition
> = {
  'Low Stock': (part: InventoryPart) => part.stock > 0 && part.stock <= part.minStock,
  'Out of Stock': (part: InventoryPart) => part.stock === 0,
};

export const INVENTORY_PART_NOTIFICATION_RULE_CONFIG: Record<
  InventoryPartNotificationPartCategory,
  InventoryPartNotificationPartRule
> = {
  'Low Stock': {
    priority: 'Medium',
    condition: INVENTORY_PART_NOTIFICATION_CONDITION_CONFIG['Low Stock'],
    message: INVENTORY_PART_NOTIFICATION_MESSAGE_CONFIG['Low Stock'],
  },
  'Out of Stock': {
    priority: 'High',
    condition: INVENTORY_PART_NOTIFICATION_CONDITION_CONFIG['Out of Stock'],
    message: INVENTORY_PART_NOTIFICATION_MESSAGE_CONFIG['Out of Stock'],
  },
};
