import { DateRange } from 'react-day-picker';

import { RepairJobFormValues } from '@/shared/repair-job/edit-repair-job-form/types';
import { RepairJob } from '@/shared/types';

export const convertRepairJobToFormValues = (repairJob: RepairJob): RepairJobFormValues => ({
  jobType: repairJob ? repairJob.jobType : null,
  jobDescription: repairJob ? repairJob.jobDetails : '',
  jobPriority: repairJob ? repairJob.jobPriority : null,
  scheduledDates: repairJob
    ? ({ from: repairJob.startDate || null, to: repairJob.endDate || null } as DateRange)
    : undefined,
  elevatorType: repairJob ? repairJob.elevatorType : null,
  buildingName: repairJob ? repairJob.buildingName : null,
  elevatorLocation: repairJob ? repairJob.elevatorLocation : null,
  technicianName: repairJob ? repairJob.technicianName : null,
  id: repairJob ? repairJob.id : '',
  calendarEventId: repairJob ? repairJob.calendarEventId : null,
  status: repairJob ? repairJob.status : null,
});

export const convertFormFieldsToRepairJob = (
  formFields: RepairJobFormValues,
  originalRepairJob?: RepairJob
): RepairJob => ({
  jobType: formFields.jobType ?? '',
  jobDetails: formFields.jobDescription ?? '',
  jobPriority: formFields.jobPriority ?? '',
  startDate: formFields.scheduledDates?.from ?? new Date(),
  endDate: formFields.scheduledDates?.to ?? new Date(),
  elevatorType: formFields.elevatorType ?? '',
  buildingName: formFields.buildingName ?? '',
  elevatorLocation: formFields.elevatorLocation ?? '',
  technicianName: originalRepairJob?.technicianName ?? formFields.technicianName ?? '',
  id: formFields.id ?? '',
  calendarEventId: originalRepairJob?.calendarEventId ?? formFields.calendarEventId ?? null,
  status: formFields.status ?? '',
});
