import { DateRange } from 'react-day-picker';

import { DropdownOption } from '@/shared/base-select/types';

export type RepairJobFormValues = {
  id: string;
  calendarEventId: string | null;
  jobType: string | null;
  jobDescription?: string;
  jobPriority: string | null;
  scheduledDates?: DateRange;
  elevatorType: string | null;
  buildingName: string | null;
  elevatorLocation: string | null;
  technicianName: string | null;
  status: string | null;
};

export type ReassignTechnicianFormValues = {
  selectedTechnician: DropdownOption | null;
};
