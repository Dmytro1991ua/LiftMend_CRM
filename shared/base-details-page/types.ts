import { ButtonVariant } from '../types';

export enum ActionButtonLabel {
  EDIT = 'Edit',
  DELETE = 'Delete',
  UPDATE_EMPLOYMENT_STATUS = 'Update Employment Status',
}

type SectionField = { id: number; label: string; value: React.ReactNode | string; fieldClassName?: string };

export type DetailsPageSectionsConfig = {
  id: number;
  title: string;
  fields: SectionField[];
};

export type DetailsPageActionButtonConfig = {
  id: number;
  label: ActionButtonLabel;
  icon: JSX.Element;
  variant: ButtonVariant;
  onClick: () => void;
};
