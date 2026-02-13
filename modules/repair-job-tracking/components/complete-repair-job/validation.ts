import { z } from 'zod';

export const checklistItemSchema = z.object({
  label: z.string(),
  checked: z.boolean(),
  comment: z.string().optional(),
});

export const completeRepairJobSchema = z.object({
  checklist: z
    .array(
      z.object({
        label: z.string(),
        checked: z.boolean(),
        comment: z.string().nullable().optional(), // allow null or undefined
      })
    )
    .refine((items) => items.every((item) => item.checked), {
      message: 'All checklist items must be completed',
    }),
});
