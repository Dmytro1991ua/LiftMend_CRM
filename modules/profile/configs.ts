import { FromInputConfig } from './types';

export const PROFILE_ACCOUNT_SETTINGS_CONFIG: FromInputConfig[] = [
  {
    id: 1,
    name: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email',
    disabled: true,
  },
  {
    id: 2,
    name: 'firstName',
    label: 'First Name',
    placeholder: 'Enter your name',
  },
  {
    id: 3,
    name: 'lastName',
    label: 'Last Name',
    placeholder: 'Enter your surname',
  },
  {
    id: 4,
    name: 'phoneNumber',
    label: 'Phone Number',
    placeholder: 'Enter your phone number',
    isLastElement: true,
    type: 'phone',
  },
];

export const PROFILE_CHANGE_PASSWORD_SETTINGS_CONFIG: FromInputConfig[] = [
  {
    id: 1,
    name: 'currentPassword',
    label: 'Current Password',
    placeholder: 'Enter your current password',
    type: 'password',
  },
  {
    id: 2,
    name: 'newPassword',
    label: 'New Password',
    placeholder: 'Enter your new password',
    type: 'password',
  },
  {
    id: 3,
    name: 'confirmPassword',
    label: 'Confirm Password',
    placeholder: 'Confirm the password',
    type: 'password',
    isLastElement: true,
  },
];
