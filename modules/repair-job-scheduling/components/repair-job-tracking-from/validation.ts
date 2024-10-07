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
    contactInformation: '',
    technicianSkills: [],
  },
};

export const jobDetailsSchema = z.object({
  jobType: z.string().min(1, 'Job Type is required'),
  jobDescription: z
    .string()
    .min(10, 'Job description must be at least 10 characters long')
    .max(300, 'Job description cannot exceed 300 characters'),
  priority: z.string().min(1, 'Priority is required'),
});

export const elevatorInformationSchema = z.object({
  elevatorType: z.string().min(1, 'Elevator type id is required'),
  buildingName: z.string().min(1, 'Building name is required'),
  elevatorLocation: z.string().min(1, 'Elevator Location is required'),
});

export const technicianAssignmentSchema = z.object({
  technicianName: z.string().min(1, 'Technician name is required'),
  technicianSkills: z
    .array(z.string())
    .min(1, 'At least one skill is required')
    .nonempty('Technician skills are required'),
  contactInformation: z
    .string({
      required_error: 'Contact Information is required',
    })
    .refine((value) => {
      const phoneRegex = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      return phoneRegex.test(value) || emailRegex.test(value);
    }, 'Contact Information must be a valid phone number or email address'),
});

export const repairJobFormSchema = z.object({
  jobDetails: jobDetailsSchema,
  elevatorInformation: elevatorInformationSchema,
  technicianAssignment: technicianAssignmentSchema,
});

export type RepairJobFromFields = z.infer<typeof repairJobFormSchema>;
