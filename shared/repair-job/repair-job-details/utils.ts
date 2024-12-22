import { isEqual as _isEqual } from 'lodash';

import { RepairJobFormValues } from '@/shared/repair-job/edit-repair-job-form/types';
import { RepairJob } from '@/shared/types';

import { OverlappingKeys } from './types';

export const convertRepairJobToFormValues = (repairJob: RepairJob): RepairJobFormValues => ({
  jobType: repairJob ? repairJob.jobType : null,
  jobDescription: repairJob ? repairJob.jobDetails : '',
  jobPriority: repairJob ? repairJob.jobPriority : null,
  scheduledDates: repairJob ? { from: repairJob.startDate || null, to: repairJob.endDate || null } : undefined,
  elevatorType: repairJob ? repairJob.elevatorType : null,
  buildingName: repairJob ? repairJob.buildingName : null,
  elevatorLocation: repairJob ? repairJob.elevatorLocation : null,
  technicianName: repairJob ? repairJob.technicianName : null,
  id: repairJob ? repairJob.id : '',
  calendarEventId: repairJob ? repairJob.calendarEventId : null,
  status: repairJob ? repairJob.status : null,
});

export const convertFormFieldsToRepairJob = (formFields: RepairJobFormValues): RepairJob => ({
  jobType: formFields.jobType ?? '',
  jobDetails: formFields.jobDescription ?? '',
  jobPriority: formFields.jobPriority ?? '',
  startDate: formFields.scheduledDates?.from ?? new Date(),
  endDate: formFields.scheduledDates?.to ?? new Date(),
  elevatorType: formFields.elevatorType ?? '',
  buildingName: formFields.buildingName ?? '',
  elevatorLocation: formFields.elevatorLocation ?? '',
  technicianName: formFields.technicianName ?? '',
  id: formFields.id ?? '',
  calendarEventId: formFields.calendarEventId ?? null,
  status: formFields.status ?? '',
});

export const getFieldsToUpdate = (updatedRepairJob: RepairJob, originalRepairJob: RepairJob): Partial<RepairJob> => {
  const fieldsToUpdate: Partial<RepairJob> = {};

  (Object.keys(updatedRepairJob) as Array<OverlappingKeys>).forEach((key) => {
    const newValue = updatedRepairJob[key];
    const originalValue = originalRepairJob[key];

    if (!_isEqual(newValue, originalValue) && newValue !== null) {
      fieldsToUpdate[key] = newValue;
    }
  });

  return fieldsToUpdate;
};
