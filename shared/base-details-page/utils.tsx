import { AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

import ElevatorStatusToggleCell from '@/modules/elevator-management/components/elevator-status-toggle-cell';
import CompleteRepairJob from '@/modules/repair-job-tracking/components/complete-repair-job/CompleteRepairJob';
import EmploymentStatusToggleCell from '@/modules/technician-management/components/employment-status-toggle-cell';

import { ElevatorRecord, RepairJob, TechnicianRecord } from '../types';

import { getEditButtonDisabledState } from './config';
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
  technicianRecord,
}: {
  onOpenEditModal: () => void;
  onOpenDeleteModal: () => void;
  technicianRecord: TechnicianRecord;
}): DetailsPageActionButtonConfig[] => {
  return [
    ...getCommonDetailsPageActionButtonsConfig({
      onOpenDeleteModal,
      onOpenEditModal,
      status: technicianRecord.availabilityStatus ?? '',
    }),
    {
      id: 3,
      render: () => (
        <EmploymentStatusToggleCell
          availabilityStatus={technicianRecord.availabilityStatus}
          employmentStatus={technicianRecord.employmentStatus ?? ''}
          lastKnownAvailabilityStatus={technicianRecord.lastKnownAvailabilityStatus}
          technicianId={technicianRecord.id}
          variant='button'
        />
      ),
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

export const getElevatorDetailsPageActionButtonsConfig = ({
  onOpenDeleteModal,
  onOpenEditModal,
  elevatorRecord,
}: {
  onOpenEditModal: () => void;
  onOpenDeleteModal: () => void;
  elevatorRecord: Omit<ElevatorRecord, 'downtimeHistory'>;
}) => {
  return [
    ...getCommonDetailsPageActionButtonsConfig({ onOpenDeleteModal, onOpenEditModal, status: elevatorRecord.status }),
    {
      id: 3,
      render: () => <ElevatorStatusToggleCell elevatorRecord={elevatorRecord} variant='button' />,
    },
  ];
};
