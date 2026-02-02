import { BaseTooltipProps } from '../base-tooltip/BaseTooltip';
import { ButtonVariant } from '../types';

export enum ActionButtonLabel {
  EDIT = 'Edit',
  DELETE = 'Delete',
  UPDATE_EMPLOYMENT_STATUS = 'Update Employment Status',
}

type SectionField = {
  id: number;
  label: string;
  value: React.ReactNode | string;
  fieldClassName?: string;
  valueClassName?: string;
};

export type DetailsPageSectionsConfig = {
  id: number;
  title: string;
  fields: SectionField[];
};

export type DetailsPageActionButtonConfig = {
  id: number;
  label?: ActionButtonLabel;
  icon?: JSX.Element;
  variant?: ButtonVariant;
  tooltipData?: Partial<BaseTooltipProps>;
  isDisabled?: boolean;
  onClick?: () => void;
  render?: () => React.ReactNode;
};
