import { AiFillEdit } from 'react-icons/ai';
import { FaEye } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

import CompleteRepairJob from '@/modules/repair-job-tracking/components/complete-repair-job/CompleteRepairJob';

import { getEditButtonDisabledState } from '../repair-job/config';
import { RepairJob } from '../types';

import { ActionButtonLabel, DetailsPageActionButtonConfig } from './types';

export const getCommonDetailsPageActionButtonsConfig = ({
  onOpenDeleteModal,
  onOpenEditModal,
  status = '',
}: {
  onOpenEditModal: () => void;
  onOpenDeleteModal: () => void;
  status?: string;
}): DetailsPageActionButtonConfig[] => {
  const { isEditButtonDisabled, tooltipMessage } = getEditButtonDisabledState(status)[status] || {};

  return [
    {
      id: 1,
      variant: 'default',
      label: ActionButtonLabel.EDIT,
      icon: <AiFillEdit />,
      onClick: () => onOpenEditModal(),
      tooltipData: {
        id: 'edit-button-tooltip',
        message: tooltipMessage,
        disable: isEditButtonDisabled,
        className: 'w-[33rem]',
      },
      isDisabled: isEditButtonDisabled,
    },
    {
      id: 2,
      variant: 'destructive',
      label: ActionButtonLabel.DELETE,
      icon: <MdDelete />,
      // TODO: remove if permission flow will be implemented
      tooltipData: {
        id: 'delete-button-tooltip',
        message: 'You do not have permission to proceed with this action',
        disable: true,
        className: 'w-[33rem]',
      },
      isDisabled: true, // TODO: remove if permission flow will be implemented
      onClick: () => onOpenDeleteModal(),
    },
  ];
};

export const getTechnicianDetailsPageActionButtonsConfig = ({
  onOpenEditModal,
  onOpenDeleteModal,
  onOpenUpdateEmploymentStatusModal,
}: {
  onOpenEditModal: () => void;
  onOpenDeleteModal: () => void;
  onOpenUpdateEmploymentStatusModal: () => void;
}): DetailsPageActionButtonConfig[] => {
  return [
    ...getCommonDetailsPageActionButtonsConfig({ onOpenDeleteModal, onOpenEditModal }),
    {
      id: 3,
      variant: 'default',
      label: ActionButtonLabel.UPDATE_EMPLOYMENT_STATUS,
      icon: <FaEye />,
      onClick: () => onOpenUpdateEmploymentStatusModal(),
    },
  ];
};

export const getRepairJobDetailsPageActionButtonsConfig = ({
  onOpenDeleteModal,
  onOpenEditModal,
  repairJob,
}: {
  onOpenEditModal: () => void;
  onOpenDeleteModal: () => void;
  repairJob: RepairJob;
}): DetailsPageActionButtonConfig[] => {
  return [
    ...getCommonDetailsPageActionButtonsConfig({ onOpenDeleteModal, onOpenEditModal, status: repairJob.status }),
    {
      id: 3,
      render: () => <CompleteRepairJob repairJob={repairJob} variant='button' />,
    },
  ];
};
