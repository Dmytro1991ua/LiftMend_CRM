import { z } from 'zod';

const passwordMatchValidation = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) =>
  schema.refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export const INITIAL_SIGN_UP_FORM_VALUES = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
};

export const INITIAL_SIGN_IN_FORM_VALUES = {
  email: '',
  password: '',
};

export const INITIAL_FORGOT_PASSWORD_FORM_VALUES = {
  email: '',
};

export const INITIAL_RESET_PASSWORD_FORM_VALUES = {
  password: '',
  confirmPassword: '',
};

const emailSchema = z
  .string({
    required_error: 'Email is required',
  })
  .min(1, 'Email is required')
  .email('Invalid email address');
const passwordSchema = z
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
const confirmPasswordSchema = z.string().min(1, 'Confirm Password is required');
const phoneNumberSchema = z
  .string()
  .optional()
  .refine((phone) => !phone || /^[+]?[0-9]{10,15}$/.test(phone), {
    message: 'Invalid phone number format. Should be between 10 to 15 digits',
  });

export const signUpSchema = passwordMatchValidation(
  z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
    phoneNumber: phoneNumberSchema,
  })
);

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = passwordMatchValidation(
  z.object({
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
);

export type SignUpFormFields = z.infer<typeof signUpSchema>;
export type SignInFormFields = z.infer<typeof signInSchema>;
export type ForgotPasswordFormFields = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormFields = z.infer<typeof resetPasswordSchema>;
