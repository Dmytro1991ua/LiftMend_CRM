import { z } from 'zod';

import { baseContactInfoSchema } from '@/shared/validation';

export const INITIAL_TECHNICIAN_RECORD_FORM_VALUES = {
  basicInformation: {
    fullName: '',
    contactInformation: '',
    availabilityStatus: 'Available' as const,
    employmentStatus: 'Active' as const,
  },
  skillsAndCertifications: {
    skills: [],
    certifications: [],
  },
};

export const basicInformationSchema = z.object({
  fullName: z.string().min(1, 'Technician full name is required'),
  contactInformation: baseContactInfoSchema,
  availabilityStatus: z.preprocess(() => 'Available', z.literal('Available')),
  employmentStatus: z.preprocess(() => 'Active', z.literal('Active')),
});

export const skillsAndCertificationsSchema = z.object({
  skills: z.array(z.string()).min(1, 'Technician skills are required').max(5, 'Limit to 5 skills'),
  certifications: z.array(z.string()).optional(),
});

export const technicianRecordFormSchema = z.object({
  basicInformation: basicInformationSchema,
  skillsAndCertifications: skillsAndCertificationsSchema,
});

export type TechnicianRecordFormFields = z.infer<typeof technicianRecordFormSchema>;
