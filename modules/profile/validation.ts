import { z } from 'zod';

const passwordMatchValidation = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) =>
  schema.superRefine((data, ctx) => {
    if (data.newPassword && data.confirmPassword && data.newPassword !== data.confirmedPassword) {
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
    newPassword: z
      .string()
      .optional()
      .refine((password) => !password || password.length >= 8, {
        message: 'Password must be at least 8 characters long',
      })
      .refine((password) => !password || password.length <= 32, {
        message: 'Password must not exceed 32 characters',
      })
      .refine((password) => !password || /[A-Z]/.test(password), {
        message: 'Password must contain at least one uppercase letter',
      })
      .refine((password) => !password || /[a-z]/.test(password), {
        message: 'Password must contain at least one lowercase letter',
      })
      .refine((password) => !password || /[0-9]/.test(password), {
        message: 'Password must contain at least one number',
      })
      .refine((password) => !password || /[@$!%*?&]/.test(password), {
        message: 'Password must contain at least one special character (@$!%*?&)',
      })
      .refine((password) => !password || !password.includes(' '), {
        message: 'Password cannot contain spaces',
      }),
    confirmedPassword: z.string().optional(),
    phoneNumber: z
      .string()
      .optional()
      .refine((phone) => !phone || /^[+]?[0-9]{10,15}$/.test(phone), {
        message: 'Invalid phone number format. Should be between 10 to 15 digits',
      }),
  })
);

export type ProfileContentFormFields = z.infer<typeof profileFormSchema>;
