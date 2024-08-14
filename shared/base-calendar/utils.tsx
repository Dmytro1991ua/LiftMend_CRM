import { DateSelectArg } from '@fullcalendar/core';
import { FaEdit, FaTrash } from 'react-icons/fa';

import RepairJobForm from '@/modules/repair-job-tracking/components/repair-job-tracking-from';
import BaseModal from '@/shared/base-modal';
import ModalFooter from '@/shared/base-modal/modal-footer';

import { DEFAULT_CREATE_MODAL_TITLE, DEFAULT_DELETE_MODAL_DESCRIPTION, DEFAULT_DELETE_MODAL_TITLE } from './constants';

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
    content: <FaTrash className='cursor-pointer' size={15} onClick={handleDeleteButtonClick} />,
  },
];

export const getEventModalsConfig = ({
  isDeleteEventModalOpen,
  onCloseDeleteEventModalOpen,
  onDeleteCalendarEventAndRepairJob,
  isLoading,
}: {
  isDeleteEventModalOpen?: boolean;
  onCloseDeleteEventModalOpen?: () => void;
  onDeleteCalendarEventAndRepairJob?: () => void;
  isLoading?: boolean;
}) => [
  {
    id: 1,
    content: (
      <BaseModal
        isOpen={isDeleteEventModalOpen}
        modalFooter={
          <ModalFooter
            cancelButtonLabel='Cancel'
            isLoading={isLoading}
            submitButtonLabel='Ok'
            onCancel={onCloseDeleteEventModalOpen}
            onSubmit={onDeleteCalendarEventAndRepairJob}
          />
        }
        title={DEFAULT_DELETE_MODAL_TITLE}
        onClose={onCloseDeleteEventModalOpen}
      >
        {DEFAULT_DELETE_MODAL_DESCRIPTION}
      </BaseModal>
    ),
  },
];

export const getCalendarModalsConfig = ({
  isCreateEventModalOpen,
  selectedDateRange,
  onReset,
}: {
  isCreateEventModalOpen: boolean;
  selectedDateRange: DateSelectArg | null;
  onReset: () => void;
}) => {
  return [
    {
      id: 1,
      content: (
        <BaseModal isOpen={isCreateEventModalOpen} title={DEFAULT_CREATE_MODAL_TITLE} onClose={onReset}>
          <RepairJobForm selectedDateRange={selectedDateRange} onReset={onReset} />
        </BaseModal>
      ),
    },
  ];
};
