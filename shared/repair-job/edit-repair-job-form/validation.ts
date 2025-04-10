import { z } from 'zod';

import { baseJobDescriptionSchema } from '@/shared/validation';

export const repairJobEditFormSchema = z.object({
  jobDescription: baseJobDescriptionSchema,
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
  id: z.string().optional(),
  calendarEventId: z.string().optional(),
  status: z.string().optional().nullable(),
});
