import { z } from 'zod';

import { formatPhoneNumber } from './utils';

export const passwordMatchValidation = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) =>
  schema.superRefine((data, ctx) => {
    const password = data.password ?? data.newPassword;
    const confirmPassword = data.confirmPassword;

    if (password && confirmPassword && password !== confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        message: 'Passwords do not match',
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.newPassword && !data.currentPassword) {
      ctx.addIssue({
        path: ['currentPassword'],
        message: 'Current password is required when setting a new password',
        code: z.ZodIssueCode.custom,
      });
    }
  });

export const basePhoneNumberSchema = z
  .string()
  .optional()
  .transform(formatPhoneNumber)
  .refine((phone) => !phone || /^\+\d{10,15}$/.test(phone), {
    message: 'Invalid phone number. Use international format (e.g., for US +1 415 555 2671)',
  });

export const basePasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(32, 'Password must not exceed 32 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[@$!%*?&]/, 'Password must contain at least one special character (@$!%*?&)')
  .refine((password) => !password.includes(' '), {
    message: 'Password cannot contain spaces',
  });

export const baseContactInfoSchema = z
  .string({
    required_error: 'Contact information is required',
  })
  .refine((value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(value);
  }, 'Contact information must be a valid email address');

export const baseJobDescriptionSchema = z
  .string()
  .min(10, 'Job description must be at least 10 characters long')
  .max(300, 'Job description cannot exceed 300 characters');
