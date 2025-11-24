import { ElevatorRecord } from '@/shared/types';

import { ELEVATOR_HEALTH_SCORE_THRESHOLDS } from './components/health-score-cell/configs';
import { ElevatorHealthScore, ElevatorHealthTooltipMessageParams, ElevatorRecordFormValues } from './types';

export const convertElevatorRecordToFormValues = (elevatorRecord: ElevatorRecord): ElevatorRecordFormValues => ({
  elevatorType: elevatorRecord ? elevatorRecord.elevatorType : null,
  capacity: elevatorRecord ? elevatorRecord.capacity : null,
  buildingName: elevatorRecord ? elevatorRecord.buildingName : null,
  elevatorLocation: elevatorRecord ? elevatorRecord.elevatorLocation : null,
  id: elevatorRecord ? elevatorRecord.id : '',
  status: elevatorRecord ? elevatorRecord.status : null,
  lastMaintenanceDate: elevatorRecord ? elevatorRecord.lastMaintenanceDate : undefined,
  nextMaintenanceDate: elevatorRecord ? elevatorRecord.nextMaintenanceDate : undefined,
});

export const convertFormFieldsToElevatorRecord = (formFields: ElevatorRecordFormValues): ElevatorRecord => ({
  elevatorType: formFields.elevatorType ?? '',
  capacity: formFields.capacity ?? null,
  lastMaintenanceDate: formFields.lastMaintenanceDate ?? new Date(),
  nextMaintenanceDate: formFields.nextMaintenanceDate ?? new Date(),
  buildingName: formFields.buildingName ?? '',
  elevatorLocation: formFields.elevatorLocation ?? '',
  id: formFields.id ?? '',
  status: formFields.status ?? '',
});

export const getElevatorHealthScoreColor = (healthScore?: number | null): ElevatorHealthScore | null => {
  if (healthScore == null) return null;

  const healthScoreLevel = ELEVATOR_HEALTH_SCORE_THRESHOLDS.find(({ value }) => healthScore >= value);

  if (!healthScoreLevel) return null;

  return {
    ...healthScoreLevel,
    value: healthScore,
  };
};

export const getElevatorHealthTooltipMessage = ({ score, label, description }: ElevatorHealthTooltipMessageParams) =>
  `Elevator Health Score: ${score} – ${label}. ${description}`;
