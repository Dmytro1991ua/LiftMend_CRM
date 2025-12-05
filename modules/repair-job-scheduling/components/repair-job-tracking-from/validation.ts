import { z } from 'zod';

import { baseJobDescriptionSchema } from '@/shared/validation';

export const INITIAL_REPAIR_JOB_VALUES = {
  jobDetails: {
    jobType: '',
    jobDescription: '',
    priority: '',
  },
  elevatorInformation: {
    elevatorType: '',
    buildingName: '',
    elevatorLocation: '',
  },
  technicianAssignment: {
    selectedTechnician: {
      id: '',
      value: '',
      label: '',
    },
  },
};

export const jobDetailsSchema = z.object({
  jobType: z.string().min(1, 'Job Type is required'),
  jobDescription: baseJobDescriptionSchema,
  priority: z.string().min(1, 'Priority is required'),
});

export const elevatorInformationSchema = z.object({
  elevatorType: z.string().min(1, 'Elevator type id is required'),
  buildingName: z.string().min(1, 'Building name is required'),
  elevatorLocation: z.string().min(1, 'Elevator Location is required'),
});

export const technicianAssignmentSchema = z.object({
  selectedTechnician: z
    .object({
      id: z.string().min(1, 'Technician is required'), // ensures a valid id
      value: z.string(),
      label: z.string(),
    })
    .nullable()
    .refine((val) => val !== null, 'Technician is required'), // ensure not null
});

export const repairJobFormSchema = z.object({
  jobDetails: jobDetailsSchema,
  elevatorInformation: elevatorInformationSchema,
  technicianAssignment: technicianAssignmentSchema,
});

export type RepairJobFromFields = z.infer<typeof repairJobFormSchema>;
