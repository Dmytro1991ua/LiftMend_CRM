import { z } from 'zod';

import { basePasswordSchema, basePhoneNumberSchema, passwordMatchValidation } from '@/shared/validation';

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
const passwordSchema = basePasswordSchema;
const confirmPasswordSchema = z.string().min(1, 'Confirm Password is required');

export const signUpSchema = passwordMatchValidation(
  z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
    phoneNumber: basePhoneNumberSchema,
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
