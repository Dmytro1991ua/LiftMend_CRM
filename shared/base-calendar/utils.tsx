import { FaEdit, FaTrash } from 'react-icons/fa';

import RepairJobForm from '@/modules/repair-job-tracking/components/repair-job-tracking-from/RepairJobForm';
import BaseModal from '@/shared/base-modal';
import ModalFooter from '@/shared/base-modal/modal-footer';

import { DEFAULT_CREATE_MODAL_TITLE, DEFAULT_DELETE_MODAL_TITLE } from './constants';

enum Steps {
  JobDetails,
  ElevatorInformation,
  TechnicianAssignment,
}

export const getEventActionsConfig = (
  handleEditButtonClick: (e: React.MouseEvent<SVGElement, MouseEvent>) => void,
  handleDeleteButtonClick: (e: React.MouseEvent<SVGElement, MouseEvent>) => void
) => [
  {
    id: 1,
    content: <FaEdit className='mr-1' size={15} onClick={handleEditButtonClick} />,
  },
  {
    id: 2,
    content: <FaTrash size={15} onClick={handleDeleteButtonClick} />,
  },
];

export const getEventModalsConfig = (isDeleteEventModalOpen?: boolean, onCloseDeleteEventModalOpen?: () => void) => [
  {
    id: 1,
    content: (
      <BaseModal
        isOpen={isDeleteEventModalOpen}
        modalFooter={
          <ModalFooter
            cancelButtonLabel='Cancel'
            submitButtonLabel='Ok'
            onCancel={onCloseDeleteEventModalOpen}
            onSubmit={onCloseDeleteEventModalOpen}
          />
        }
        title={DEFAULT_DELETE_MODAL_TITLE}
        onClose={onCloseDeleteEventModalOpen}
      />
    ),
  },
];

export const getCalendarModalsConfig = (
  isCreateEventModalOpen: boolean,
  onCloseCreateEventModalOpen: () => void,
  onSubmit?: () => Promise<void> | void
) => {
  return [
    {
      id: 1,
      content: (
        <BaseModal
          isOpen={isCreateEventModalOpen}
          title={DEFAULT_CREATE_MODAL_TITLE}
          onClose={onCloseCreateEventModalOpen}
        >
          <RepairJobForm onSubmit={onSubmit} />
        </BaseModal>
      ),
    },
  ];
};
