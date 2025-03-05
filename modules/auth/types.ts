import { InputType } from '@/shared/base-input/form-input/FormInput';
import { AppRoutes } from '@/types/enums';

export enum AuthButtonLabel {
  LOGIN = 'Login',
  SIGN_UP = 'Sign Up',
  FORGOT_PASSWORD = 'Forgot Password',
  RESET_PASSWORD = 'Reset Password',
}

export enum AuthFormType {
  SIGN_UP = 'signUp',
  SIGN_IN = 'signIn',
  FORGOT_PASSWORD = 'forgotPassword',
  RESET_PASSWORD = 'resetPassword',
}

export enum FieldLabel {
  FIRST_NAME = 'First Name',
  LAST_NAME = 'Last Name',
  EMAIL = 'Email',
  PASSWORD = 'Password',
  CONFIRM_PASSWORD = 'Confirm Password',
  PHONE_NUMBER = 'Phone Number',
  FORGOT_PASSWORD = 'Forgot Password?',
}

export enum FormFieldPlaceholder {
  EMAIL = 'Enter your email address',
  PASSWORD = 'Enter your password',
  CONFIRM_PASSWORD = 'Confirm your password',
  PHONE_NUMBER = 'Enter your phone number',
  FIRST_NAME = 'Enter your first name',
  LAST_NAME = 'Enter your last name',
}

export enum RedirectionLinkTitle {
  SIGN_IN = "Don't have an account? Sign Up",
  SIGN_UP = 'Already have an account? Sign In',
  FORGOT_PASSWORD = 'Remembered your password? Sign In',
  RESET_PASSWORD = 'Want to log in? Sign In',
}

export enum AuthFormHeader {
  SIGN_UP_TITLE = 'Create a new account',
  SIGN_UP_DESCRIPTION = 'Sign up to manage and track elevator repairs effortlessly.',

  SIGN_IN_TITLE = 'Login',
  SIGN_IN_DESCRIPTION = 'Sign In to manage elevator repairs.',

  FORGOT_PASSWORD_TITLE = 'Forgot Password',
  FORGOT_PASSWORD_DESCRIPTION = 'Enter your email to receive a password reset link.',

  RESET_PASSWORD_TITLE = 'Reset Password',
  RESET_PASSWORD_DESCRIPTION = 'Set a new password to regain access to your account.',
}

type LinkType = 'link';

export type FormField = {
  id: number;
  name: string;
  label: FieldLabel;
  placeholder?: FormFieldPlaceholder;
  type?: InputType | LinkType;
  route?: string;
  className?: string;
  isLastElement?: boolean;
};

export type FormRedirectionLink = {
  title: RedirectionLinkTitle;
  route: AppRoutes;
};

export type AuthFormHeadersConfig = {
  title: AuthFormHeader;
  description: AuthFormHeader;
};

export type FormFieldsConfig = Record<AuthFormType, FormField[]>;
export type FormRedirectionLinkConfig = Record<AuthFormType, FormRedirectionLink>;
export type FormHeadersConfig = Record<AuthFormType, AuthFormHeadersConfig>;
