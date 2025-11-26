export enum ElevatorRecordSteps {
  ElevatorDetails,
  MaintenanceInformation,
}

export enum HealthScoreLabel {
  Excellent = 'Excellent',
  Good = 'Good',
  Fair = 'Poor',
  Poor = 'Critical',
}

export enum HealthScoreTooltipDescription {
  Excellent = 'Almost perfect condition',
  Good = 'Slight issues, monitor closely',
  Fair = 'Needs maintenance soon',
  Poor = 'High risk, immediate repair required',
}

export type ElevatorRecordFormValues = {
  id: string;
  elevatorType: string | null;
  elevatorLocation: string | null;
  buildingName: string | null;
  status: string | null;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  capacity: number | null;
};

export type ElevatorStatus = 'Operational' | 'Out of Service';
export type ElevatorStatusConfig = {
  icon: JSX.Element;
  newElevatorStatus: ElevatorStatus | string;
  modalTitle: string;
  modalMessage: string;
  dataTestId?: string;
};

export type HealthScoreStyleClasses = {
  background: string;
  text: string;
  border: string;
};

export type ElevatorHealthTooltip = {
  id: string;
  getTooltipMessage: (score: number) => string;
};

export type ElevatorHealthTooltipMessageParams = {
  score: number;
  label: HealthScoreLabel;
  description: HealthScoreTooltipDescription;
};

export type ElevatorHealthScore = {
  value: number;
  color: string;
  label: HealthScoreLabel;
  classes: HealthScoreStyleClasses;
  activeDots: number;
  tooltipProps: ElevatorHealthTooltip;
};
