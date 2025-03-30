import { Path } from 'react-hook-form';

import { InputType } from '@/shared/base-input/form-input/FormInput';
import { ButtonVariant } from '@/shared/types';

import { ProfileContentFormFields } from './validation';

export enum ProfileContentTitle {
  AccountSettings = 'Account Settings',
  ChangePassword = 'Change Password',
}

export enum ProfileContentSubtitle {
  UserInformation = 'User Information',
  PasswordManagement = 'Password Management',
}

export enum ProfileFormButtonLabel {
  DiscardChanges = 'Discard Changes',
  UpdateProfile = 'Update Profile',
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

export type FromInputConfig = {
  id: number;
  name: Path<ProfileContentFormFields>;
  placeholder: string;
  type?: InputType;
  label?: string;
  disabled?: boolean;
  isLastElement?: boolean;
  defaultValue?: string;
};

export type ProfileActionButtonConfig = {
  id: number;
  icon: JSX.Element;
  label: ProfileFormButtonLabel;
  variant: ButtonVariant;
  isDisabled?: boolean;
  isLoading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick: () => void;
};

export type ProfileContentConfig = {
  id: number;
  title: ProfileContentTitle;
  subtitle: ProfileContentSubtitle;
  component: JSX.Element;
};
