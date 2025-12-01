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
