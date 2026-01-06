export type DAAPIChangeLog = {
  id: string;
  entityType: string;
  entityId: string;
  createdAt: Date;
  userId: string | null;
  action: string;
  field: string;
  oldValue: string | null;
  newValue: string | null;
};
