import { z } from 'zod';

import { basePasswordSchema, basePhoneNumberSchema, passwordMatchValidation } from '@/shared/validation';

export const optionalPasswordSchema = z.preprocess((val) => {
  if (typeof val === 'string' && val.trim() === '') {
    return undefined;
  }

  return val;
}, basePasswordSchema.optional());

export const profileFormSchema = passwordMatchValidation(
  z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z
      .string()
      .optional()
      .refine((email) => !email || /\S+@\S+\.\S+/.test(email), {
        message: 'Invalid email address',
      }),
    currentPassword: z.string().optional(),
    newPassword: optionalPasswordSchema,
    confirmPassword: z.string().optional(),
    phoneNumber: basePhoneNumberSchema,
  })
);

export type ProfileContentFormFields = z.infer<typeof profileFormSchema>;
