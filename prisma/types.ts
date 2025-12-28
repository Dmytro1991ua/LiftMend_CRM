export type ChangeLogAction = 'create' | 'update' | 'delete';
export type ChangeLogCreateParams = {
  entityType: string;
  entityId: string;
  action: 'create' | 'update' | 'delete';
  oldValue: unknown;
  newValue: unknown;
};
export type EntityWithId = {
  id: string;
  [key: string]: unknown;
};
