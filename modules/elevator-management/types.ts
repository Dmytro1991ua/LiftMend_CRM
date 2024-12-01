export enum ElevatorRecordSteps {
  ElevatorDetails,
  MaintenanceInformation,
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
