export type DAAPIRepairJobChecklistItem = {
  label: string;
  checked: boolean;
};

export type DAAPIRepairJob = {
  id: string;
  jobType: string;
  jobDetails: string;
  jobPriority: string;
  elevatorType: string;
  buildingName: string;
  elevatorLocation: string;
  technicianName: string;
  startDate: Date;
  endDate: Date;
  status: string;
  actualEndDate?: Date | null;
  calendarEventId?: string | null;
  elevatorId?: string | null;
  technicianId?: string | null;
  isOverdue?: boolean | null;
  checklist?: DAAPIRepairJobChecklistItem[] | null;
};
