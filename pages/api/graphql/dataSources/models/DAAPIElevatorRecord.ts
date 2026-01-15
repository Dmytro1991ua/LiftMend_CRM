export type DAAPIElevatorRecord = {
  id: string;
  elevatorType: string;
  buildingName: string;
  elevatorLocation: string;
  lastMaintenanceDate: Date;
  nextMaintenanceDate: Date;
  capacity: number;
  status: string;
  lastKnownStatus?: string | null;
  lastInspectionDate?: Date | null;
  nextInspectionDate?: Date | null;
};
