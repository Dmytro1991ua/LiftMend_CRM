import { keys as _keys, union as _union } from 'lodash';

import { FieldChange } from '@/graphql/types/server/generated_types';

import { JSONRecord } from './../types';
import { computeFieldChangesForKeys } from './utils';

type FieldChangeHandlerConfig = Record<string, () => FieldChange[]>;

/**
 * Action-specific rules for generating field-level changes
 * from oldValue and newValue.
 *
 * - create: fields come only from the next state
 * - update: fields are diffed between previous and next state
 * - delete: fields come only from the previous state
 */
export const getFieldChangeHandlersByAction = (
  previousState: JSONRecord,
  nextState: JSONRecord
): FieldChangeHandlerConfig => {
  return {
    update: () =>
      computeFieldChangesForKeys({
        action: 'update',
        keys: _union(_keys(previousState), _keys(nextState)),
        getOld: (k) => previousState[k] ?? null,
        getNew: (k) => nextState[k] ?? null,
      }),

    create: () =>
      computeFieldChangesForKeys({
        action: 'create',
        keys: _keys(nextState),
        getOld: () => null,
        getNew: (k) => nextState[k] ?? null,
      }),

    delete: () =>
      computeFieldChangesForKeys({
        action: 'delete',
        keys: _keys(previousState),
        getOld: (k) => previousState[k] ?? null,
        getNew: () => null,
      }),
  };
};
