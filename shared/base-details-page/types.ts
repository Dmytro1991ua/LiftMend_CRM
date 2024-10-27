import { ButtonVariant } from '../types';

export enum ActionButtonLabel {
  EDIT = 'Edit',
  DELETE = 'Delete',
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
