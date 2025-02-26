import { z } from 'zod';

export const INITIAL_SIGN_UP_FORM_VALUES = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
};

export const signUpSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .min(1, 'Email is required')
      .email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(32, 'Password must not exceed 32 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[@$!%*?&]/, 'Password must contain at least one special character (@$!%*?&)')
      .refine((password) => !password.includes(' '), 'Password cannot contain spaces'),
    confirmPassword: z
      .string()
      .min(8, 'Confirm Password must be at least 8 characters long')
      .max(32, 'Confirm Password must not exceed 32 characters'),
    phoneNumber: z
      .string({
        required_error: 'Phone number is required',
      })
      .refine((phone) => phone === '' || /^[+]?[0-9]{10,15}$/.test(phone), {
        message: 'Invalid phone number format. Should be between 10 to 15 digits',
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        message: 'Passwords do not match',
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type SignUpFromFields = z.infer<typeof signUpSchema>;
