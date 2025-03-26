import { InputType } from '@/shared/base-input/form-input/FormInput';

export enum ProfileContentTitle {
  AccountSettings = 'Account Settings',
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
  fullWidth?: boolean;
  id: number;
  name: string;
  placeholder: string;
  type?: InputType;
  label?: string;
  disabled?: boolean;
  isLastElement?: boolean;
}
