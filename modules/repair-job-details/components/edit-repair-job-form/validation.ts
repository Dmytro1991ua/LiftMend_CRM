import { z } from 'zod';

export const repairJobDetailsFormSchema = z.object({
  jobDescription: z
    .string()
    .min(10, 'Job description must be at least 10 characters long')
    .max(300, 'Job description cannot exceed 300 characters'),
  technicianSkill: z
    .array(z.string())
    .min(1, 'At least one skill is required')
    .nonempty('Technician skills are required'),
  contactInfo: z
    .string({
      required_error: 'Contact Information is required',
    })
    .refine((value) => {
      const phoneRegex = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      return phoneRegex.test(value) || emailRegex.test(value);
    }, 'Contact Information must be a valid phone number or email address'),
  jobType: z.string().optional().nullable(),
  jobPriority: z.string().optional().nullable(),
  scheduledDates: z
    .object({
      from: z.string().optional(),
      to: z.string().optional(),
    })
    .optional()
    .nullable(),
  elevatorType: z.string().optional().nullable(),
  buildingName: z.string().optional().nullable(),
  elevatorLocation: z.string().optional().nullable(),
  technicianName: z.string().optional().nullable(),
  id: z.string().optional(),
  calendarEventId: z.string().optional(),
});
