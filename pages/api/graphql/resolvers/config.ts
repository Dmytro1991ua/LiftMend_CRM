import { keys as _keys, union as _union } from 'lodash';

import { FieldChange } from '@/graphql/types/server/generated_types';

import { DAAPIRepairJobChecklistItem } from '../dataSources/models/DAAPIRepairJob';

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

export const REPAIR_JOB_CHECKLIST_CONFIG: Record<string, DAAPIRepairJobChecklistItem[]> = {
  Repair: [
    { label: 'Door sensors checked', checked: false },
    { label: 'Emergency stop tested', checked: false },
    { label: 'Cabin leveling verified', checked: false },
    { label: 'Control panel inspected', checked: false },
    { label: 'Safety brakes tested', checked: false },
  ],
  Maintenance: [
    { label: 'Lubrication checked', checked: false },
    { label: 'Emergency stop tested', checked: false },
    { label: 'Alarm tested', checked: false },
    { label: 'Guides cleaned', checked: false },
    { label: 'Motor and gearbox inspected', checked: false },
  ],
  Installation: [
    { label: 'Door alignment verified', checked: false },
    { label: 'Safety brakes installed', checked: false },
    { label: 'Control panel configured', checked: false },
    { label: 'Cabin leveling verified', checked: false },
    { label: 'Emergency stop functional', checked: false },
  ],
  Inspection: [
    { label: 'All sensors checked', checked: false },
    { label: 'Safety stop tested', checked: false },
    { label: 'Cabin leveling verified', checked: false },
    { label: 'Door operation tested', checked: false },
    { label: 'Alarm system tested', checked: false },
  ],
  Upgrade: [
    { label: 'Upgrade kit installed', checked: false },
    { label: 'System tested', checked: false },
    { label: 'Safety devices updated', checked: false },
    { label: 'Control software updated', checked: false },
    { label: 'Emergency stop functionality verified', checked: false },
  ],
  Emergency: [
    { label: 'Emergency fix applied', checked: false },
    { label: 'Safety verified', checked: false },
    { label: 'Cabin operation checked', checked: false },
    { label: 'Door sensors checked', checked: false },
    { label: 'Alarm system functional', checked: false },
  ],
  Routine: [
    { label: 'Routine inspection completed', checked: false },
    { label: 'Lubrication applied', checked: false },
    { label: 'Door sensors checked', checked: false },
    { label: 'Safety brake tested', checked: false },
    { label: 'Emergency stop tested', checked: false },
  ],
  Consultation: [
    { label: 'Assessment done', checked: false },
    { label: 'Technical report prepared', checked: false },
    { label: 'Recommendation reviewed', checked: false },
    { label: 'Compliance notes added', checked: false },
    { label: 'Client briefing completed', checked: false },
  ],
  Modernization: [
    { label: 'Modernization components installed', checked: false },
    { label: 'System tested', checked: false },
    { label: 'Safety devices updated', checked: false },
    { label: 'Control panel upgraded', checked: false },
    { label: 'Door operation verified', checked: false },
  ],
  Compliance: [
    { label: 'Compliance checklist completed', checked: false },
    { label: 'Safety verified', checked: false },
    { label: 'Regulatory signs checked', checked: false },
    { label: 'Inspection report submitted', checked: false },
    { label: 'Emergency stop functionality verified', checked: false },
  ],
};
