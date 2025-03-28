import { Path } from 'react-hook-form';

import { InputType } from '@/shared/base-input/form-input/FormInput';

import { ProfileContentFormFields } from './validation';

export enum ProfileContentTitle {
  AccountSettings = 'Account Settings',
  ChangePassword = 'Change Password',
}

export enum ProfileContentSubtitle {
  UserInformation = 'User Information',
  PasswordManagement = 'Password Management',
}

export type Dimensions = {
  width: number;
  height: number;
};

export type ResizeImageParams = {
  file: File;
  width: number;
  height: number;
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
};

export interface FromInputConfig {
  id: number;
  name: Path<ProfileContentFormFields>;
  placeholder: string;
  type?: InputType;
  label?: string;
  disabled?: boolean;
  isLastElement?: boolean;
  defaultValue?: string;
}
