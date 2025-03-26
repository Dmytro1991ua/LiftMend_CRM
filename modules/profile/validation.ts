import { z } from 'zod';

export const INITIAL_PROFILE_FORM_VALUES = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
};

const passwordMatchValidation = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) =>
  schema.refine(
    (data) => {
      if (data.password && data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      path: ['confirmPassword'],
      message: 'Passwords do not match',
    }
  );

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
    password: z
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
    confirmPassword: z.string().optional(),
    phoneNumber: z
      .string()
      .optional()
      .refine((phone) => !phone || /^[+]?[0-9]{10,15}$/.test(phone), {
        message: 'Invalid phone number format. Should be between 10 to 15 digits',
      }),
  })
);

export type ProfileFormFields = z.infer<typeof profileFormSchema>;
