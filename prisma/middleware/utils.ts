import { ChangeLogAction, EntityWithId } from '../types';

export const buildChangeLogPayload = (
  action: ChangeLogAction,
  model: string,
  before: EntityWithId | null,
  result: EntityWithId | null
) => {
  if (action === 'create' && result?.id) {
    return { entityType: model, entityId: result.id, action, oldValue: null, newValue: result };
  }
  if ((action === 'update' || action === 'delete') && before) {
    return {
      entityType: model,
      entityId: before.id,
      action,
      oldValue: before,
      newValue: action === 'delete' ? null : result,
    };
  }
  return null;
};
