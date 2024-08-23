import { RepairJob } from '@prisma/client';
import { isEqual as _isEqual } from 'lodash';

import { OverlappingKeys, RepairJobDetailsFormValues } from './types';

export const getModalTitle = (title: string, isEdit?: boolean): string => {
  const modalActionString = isEdit ? 'Edit' : 'Delete';

  return `${modalActionString} ${title}`;
};

export const getModalDescription = (title: string): string => `Are you sure you want to delete ${title}`;

export const convertRepairJobToFormValues = (repairJob: RepairJob): RepairJobDetailsFormValues => ({
  jobType: repairJob ? repairJob.jobType : null,
  jobDescription: repairJob ? repairJob.jobDetails : '',
  jobPriority: repairJob ? repairJob.jobPriority : null,
  scheduledDates: repairJob ? { from: repairJob.startDate, to: repairJob.endDate } : undefined,
  elevatorType: repairJob ? repairJob.elevatorType : null,
  buildingName: repairJob ? repairJob.buildingName : null,
  elevatorLocation: repairJob ? repairJob.elevatorLocation : null,
  technicianName: repairJob ? repairJob.technicianName : null,
  technicianSkill: repairJob ? repairJob.technicianSkills : [],
  contactInfo: repairJob ? repairJob.contactInformation : '',
  id: repairJob ? repairJob.id : '',
  calendarEventId: repairJob ? repairJob.calendarEventId : null,
});

export const convertFormFieldsToRepairJob = (formFields: RepairJobDetailsFormValues): RepairJob => ({
  jobType: formFields.jobType ?? '',
  jobDetails: formFields.jobDescription ?? '',
  jobPriority: formFields.jobPriority ?? '',
  startDate: formFields.scheduledDates?.from ?? new Date(),
  endDate: formFields.scheduledDates?.to ?? new Date(),
  elevatorType: formFields.elevatorType ?? '',
  buildingName: formFields.buildingName ?? '',
  elevatorLocation: formFields.elevatorLocation ?? '',
  technicianName: formFields.technicianName ?? '',
  technicianSkills: formFields.technicianSkill ?? [],
  contactInformation: formFields.contactInfo ?? '',
  id: formFields.id ?? '',
  calendarEventId: formFields.calendarEventId ?? null,
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

export const formatScheduledDate = (date?: Date | string | null) => (date instanceof Date ? date.toISOString() : date);
