import { AiFillEdit } from 'react-icons/ai';
import { FaEye } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

import { ActionButtonLabel, DetailsPageActionButtonConfig } from './types';

const getEditButtonConfig = (onOpenEditModal: () => void): DetailsPageActionButtonConfig => {
  return {
    id: 1,
    variant: 'default',
    label: ActionButtonLabel.EDIT,
    icon: <AiFillEdit />,
    onClick: () => onOpenEditModal(),
  };
};

export const getCommonDetailsPageActionButtonsConfig = ({
  onOpenDeleteModal,
  onOpenEditModal,
}: {
  onOpenEditModal: () => void;
  onOpenDeleteModal: () => void;
}): DetailsPageActionButtonConfig[] => {
  return [
    { ...getEditButtonConfig(onOpenEditModal) },
    {
      id: 2,
      variant: 'destructive',
      label: ActionButtonLabel.DELETE,
      icon: <MdDelete />,
      onClick: () => onOpenDeleteModal(),
    },
  ];
};

export const getTechnicianDetailsPageActionButtonsConfig = ({
  onOpenEditModal,
  onOpenUpdateEmploymentStatusModal,
}: {
  onOpenEditModal: () => void;
  onOpenUpdateEmploymentStatusModal: () => void;
}): DetailsPageActionButtonConfig[] => {
  return [
    { ...getEditButtonConfig(onOpenEditModal) },
    {
      id: 2,
      variant: 'default',
      label: ActionButtonLabel.UPDATE_EMPLOYMENT_STATUS,
      icon: <FaEye />,
      onClick: () => onOpenUpdateEmploymentStatusModal(),
    },
  ];
};
