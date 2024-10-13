export enum ElevatorRecordSteps {
  ElevatorDetails,
  MaintenanceInformation,
  TechnicianInformation,
}

export type ElevatorRecordFormValues = {
  id: string;
  elevatorType: string | null;
  elevatorLocation: string | null;
  buildingName: string | null;
  status: string | null;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  technicianName: string | null;
  capacity: number | null;
  contactInformation?: string;
};
