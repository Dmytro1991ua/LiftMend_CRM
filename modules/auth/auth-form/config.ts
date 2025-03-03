import { AppRoutes } from '@/types/enums';

import {
  AuthFormHeader,
  AuthFormType,
  FieldLabel,
  FormFieldPlaceholder,
  FormFieldsConfig,
  FormHeadersConfig,
  FormRedirectionLinkConfig,
  RedirectionLinkTitle,
} from '../types';

export const FORM_FIELDS_CONFIG: FormFieldsConfig = {
  [AuthFormType.SIGN_UP]: [
    {
      id: 1,
      name: 'firstName',
      label: FieldLabel.FIRST_NAME,
      placeholder: FormFieldPlaceholder.FIRST_NAME,
      className: 'row-start-1 row-end-2 col-start-1 col-end-7 sm:row-start-1 sm:row-end-2 sm:col-start-1 sm:col-end-4',
    },
    {
      id: 2,
      name: 'lastName',
      label: FieldLabel.LAST_NAME,
      placeholder: FormFieldPlaceholder.LAST_NAME,
      className: 'row-start-2 row-end-3 col-start-1 col-end-7 sm:row-start-1 sm:row-end-2 sm:col-start-4 sm:col-end-7',
    },
    {
      id: 3,
      name: 'email',
      label: FieldLabel.EMAIL,
      placeholder: FormFieldPlaceholder.EMAIL,
      className: 'row-start-3 row-end-4 col-start-1 col-end-7 sm:row-start-2 sm:row-end-3',
    },
    {
      id: 4,
      name: 'password',
      label: FieldLabel.PASSWORD,
      placeholder: FormFieldPlaceholder.PASSWORD,
      type: 'password',
      className: 'row-start-4 row-end-5 col-start-1 col-end-7 sm:row-start-3 sm:row-end-4 sm:col-end-4',
    },
    {
      id: 5,
      name: 'confirmPassword',
      label: FieldLabel.CONFIRM_PASSWORD,
      placeholder: FormFieldPlaceholder.CONFIRM_PASSWORD,
      type: 'password',
      className: 'row-start-5 row-end-6 col-start-1 col-end-7 sm:row-start-3 sm:row-end-4 sm:col-start-4',
    },
    {
      id: 6,
      name: 'phoneNumber',
      label: FieldLabel.PHONE_NUMBER,
      placeholder: FormFieldPlaceholder.PHONE_NUMBER,
      className: 'row-start-6 row-end-7 col-start-1 col-end-7 sm:row-start-4 sm:row-end-5',
      type: 'number',
    },
  ],
  [AuthFormType.SIGN_IN]: [
    {
      id: 7,
      name: 'email',
      label: FieldLabel.EMAIL,
      className: 'row-start-1 row-end-2 col-start-1 col-end-7',
      placeholder: FormFieldPlaceholder.EMAIL,
    },
    {
      id: 8,
      name: 'password',
      label: FieldLabel.PASSWORD,
      className: 'row-start-2 row-end-3 col-start-1 col-end-7',
      isLastElement: true,
      placeholder: FormFieldPlaceholder.PASSWORD,
      type: 'password',
    },
    {
      id: 9,
      name: 'forgotPassword',
      type: 'link',
      label: FieldLabel.FORGOT_PASSWORD,
      route: '/forgot-password',
      className:
        'row-start-3 row-end-4 col-start-1 col-end-7 text-center mb-8 sm:col-start-4 sm:col-end-7 sm:text-right',
    },
  ],
  [AuthFormType.FORGOT_PASSWORD]: [
    {
      id: 10,
      name: 'email',
      label: FieldLabel.EMAIL,
      className: 'row-start-1 row-end-2 col-start-1 col-end-7',
      placeholder: FormFieldPlaceholder.EMAIL,
    },
  ],
  [AuthFormType.RESET_PASSWORD]: [
    {
      id: 11,
      name: 'password',
      label: FieldLabel.PASSWORD,
      className: 'row-start-1 row-end-2 col-start-1 col-end-7',
      placeholder: FormFieldPlaceholder.PASSWORD,
    },
    {
      id: 12,
      name: 'confirmPassword',
      label: FieldLabel.CONFIRM_PASSWORD,
      placeholder: FormFieldPlaceholder.CONFIRM_PASSWORD,
      className: 'row-start-2 row-end-3 col-start-1 col-end-7',
    },
  ],
};

export const FORM_REDIRECTION_LINKS_CONFIG: FormRedirectionLinkConfig = {
  [AuthFormType.SIGN_UP]: {
    title: RedirectionLinkTitle.SIGN_UP,
    route: AppRoutes.SignIn,
  },
  [AuthFormType.SIGN_IN]: {
    title: RedirectionLinkTitle.SIGN_IN,
    route: AppRoutes.SignUp,
  },
  [AuthFormType.FORGOT_PASSWORD]: {
    title: RedirectionLinkTitle.FORGOT_PASSWORD,
    route: AppRoutes.SignIn,
  },
  [AuthFormType.RESET_PASSWORD]: {
    title: RedirectionLinkTitle.RESET_PASSWORD,
    route: AppRoutes.SignIn,
  },
};

export const FORM_TITLES_CONFIG: FormHeadersConfig = {
  [AuthFormType.SIGN_UP]: {
    title: AuthFormHeader.SIGN_UP_TITLE,
    description: AuthFormHeader.SIGN_UP_DESCRIPTION,
  },
  [AuthFormType.SIGN_IN]: {
    title: AuthFormHeader.SIGN_IN_TITLE,
    description: AuthFormHeader.SIGN_IN_DESCRIPTION,
  },
  [AuthFormType.FORGOT_PASSWORD]: {
    title: AuthFormHeader.FORGOT_PASSWORD_TITLE,
    description: AuthFormHeader.FORGOT_PASSWORD_DESCRIPTION,
  },
  [AuthFormType.RESET_PASSWORD]: {
    title: AuthFormHeader.RESET_PASSWORD_TITLE,
    description: AuthFormHeader.RESET_PASSWORD_DESCRIPTION,
  },
};
