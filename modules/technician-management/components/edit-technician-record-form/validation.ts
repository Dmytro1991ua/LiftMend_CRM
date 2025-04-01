import { baseContactInfoSchema } from '@/shared/validation';
import { z } from 'zod';

export const technicianRecordEditFormSchema = z.object({
  name: z.string().min(1, 'Technician full name is required'),
  contactInformation: baseContactInfoSchema,
  availabilityStatus: z.preprocess(() => 'Available', z.literal('Available')),
  employmentStatus: z.preprocess(() => 'Active', z.literal('Active')),
  skills: z.array(z.string()).min(1, 'Technician skills are required').max(5, 'Limit to 5 skills'),
  certifications: z.array(z.string()).optional(),
});
