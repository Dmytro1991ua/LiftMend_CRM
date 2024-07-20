import { z } from 'zod';

export const repairJobFormSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  jobDescription: z
    .string()
    .min(10, 'Job description must be at least 10 characters long')
    .max(300, 'Job description cannot exceed 500 characters'),
});

export type RepairJobFromFields = z.infer<typeof repairJobFormSchema>;
