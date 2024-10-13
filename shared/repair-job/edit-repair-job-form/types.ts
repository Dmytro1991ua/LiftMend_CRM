import { DateRange } from 'react-day-picker';

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
  technicianSkill: string[];
  contactInfo?: string;
  status: string | null;
};
