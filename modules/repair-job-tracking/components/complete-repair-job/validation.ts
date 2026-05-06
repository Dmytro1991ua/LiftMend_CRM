import { z } from 'zod';

import { baseEvidencePhotoSchema } from '@/shared/validation';

export const completeRepairJobSchema = z.object({
  checklist: z
    .array(
      z.object({
        label: z.string(),
        checked: z.boolean(),
        comment: z.string().nullable().optional(),
      })
    )
    .refine((items) => items.every((item) => item.checked), {
      message: 'All checklist items must be completed',
    }),
  evidencePhoto: baseEvidencePhotoSchema,
  partsUsed: z
    .array(
      z.object({
        partId: z.string().min(1, 'Please select an inventory part'),
        quantity: z
          .string()
          .min(1, 'Quantity is required')
          .refine((val) => !isNaN(Number(val)), 'Quantity must be a number')
          .refine((val) => Number(val) > 0, 'Quantity must be at least 1')
          .refine((val) => Number(val) === Math.floor(Number(val)), 'Quantity must be a whole number'),
      })
    )
    .refine((items) => items.length > 0, {
      message: 'At least one part must be added to complete the repair',
      path: ['root'],
    }),
});
