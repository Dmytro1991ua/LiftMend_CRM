import { ButtonVariant } from '../types';

export enum ButtonLabel {
  CANCEL = 'Cancel',
  BACK = 'Back',
  NEXT = 'Next',
  SUBMIT = 'Submit',
}

export type ButtonConfig = {
  id: number;
  label: ButtonLabel;
  onClick: () => void;
  disabled?: boolean;
  visible?: boolean;
  className?: string;
  variant?: ButtonVariant;
  size?: 'sm' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  isLoading?: boolean;
};

export type StepValue = {
  id: number;
  value: string;
};
