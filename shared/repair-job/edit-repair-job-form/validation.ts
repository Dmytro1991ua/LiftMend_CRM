import { z } from 'zod';

export const repairJobEditFormSchema = z.object({
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
      from: z.string().nullable().optional(),
      to: z.string().nullable().optional(),
    })
    .refine((dates) => dates.from || dates.to, { message: 'Start date must be provided' })
    .refine((dates) => !dates.from || dates.to, { message: 'End date must be provided when a start date is set' })
    .optional()
    .nullable(),
  elevatorType: z.string().optional().nullable(),
  buildingName: z.string().optional().nullable(),
  elevatorLocation: z.string().optional().nullable(),
  technicianName: z.string().optional().nullable(),
  id: z.string().optional(),
  calendarEventId: z.string().optional(),
  status: z.string().optional().nullable(),
});
