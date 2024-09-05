import { RepairJob } from '@/graphql/types/client/generated_types';
import { RepairJobFormValues } from '@/shared/repair-job/edit-repair-job-form/types';
import { ButtonVariant } from '@/shared/types';

export enum ActionButtonLabel {
  EDIT = 'Edit',
  DELETE = 'Delete',
}

export type ActionButtonConfig = {
  id: number;
  label: ActionButtonLabel;
  icon: JSX.Element;
  variant: ButtonVariant;
  onClick: () => void;
};

export type OverlappingKeys = keyof RepairJob & keyof RepairJobFormValues;
