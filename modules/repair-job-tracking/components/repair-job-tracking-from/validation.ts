import { z } from 'zod';

enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export const repairJobFormSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  jobDescription: z
    .string()
    .min(10, 'Job description must be at least 10 characters long')
    .max(300, 'Job description cannot exceed 500 characters'),
  priority: z.enum([Priority.Low, Priority.Medium, Priority.High], {
    required_error: 'Priority is required',
  }),
});

export type RepairJobFromFields = z.infer<typeof repairJobFormSchema>;
