export enum ButtonLabel {
  CANCEL = 'Cancel',
  BACK = 'Back',
  NEXT = 'Next',
  SUBMIT = 'Submit',
}

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

export type ButtonConfig = {
  id: number;
  label: ButtonLabel;
  onClick: () => void;
  disabled?: boolean;
  visible?: boolean;
  className?: string;
  variant?: ButtonVariant;
  size?: 'sm' | 'lg';
};

export type StepValue = {
  id: number;
  value: string;
};
