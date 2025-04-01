import { baseJobDescriptionSchema } from '@/shared/validation';
import { z } from 'zod';

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
    technicianName: '',
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
  technicianName: z.string().min(1, 'Technician name is required'),
});

export const repairJobFormSchema = z.object({
  jobDetails: jobDetailsSchema,
  elevatorInformation: elevatorInformationSchema,
  technicianAssignment: technicianAssignmentSchema,
});

export type RepairJobFromFields = z.infer<typeof repairJobFormSchema>;
