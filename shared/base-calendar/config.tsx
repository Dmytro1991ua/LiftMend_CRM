import { DateSelectArg } from '@fullcalendar/core';
import { FaTrash } from 'react-icons/fa';

import RepairJobForm from '@/modules/repair-job-tracking/components/repair-job-tracking-from';
import BaseModal from '@/shared/base-modal';

import DeleteModal from '../base-modal/delete-modal';

import { DEFAULT_CREATE_MODAL_TITLE, DEFAULT_DELETE_MODAL_DESCRIPTION, DEFAULT_DELETE_MODAL_TITLE } from './constants';

export const getEventActionsConfig = (
  handleDeleteButtonClick: (e: React.MouseEvent<SVGElement, MouseEvent>) => void
) => [
  {
    id: 1,
    content: <FaTrash className='cursor-pointer' size={15} onClick={handleDeleteButtonClick} />,
  },
];

export const getEventModalsConfig = ({
  isDeleteEventModalOpen,
  onCloseDeleteEventModal,
  onDeleteCalendarEventAndRepairJob,
  isLoading,
}: {
  isDeleteEventModalOpen?: boolean;
  onCloseDeleteEventModal?: () => void;
  onDeleteCalendarEventAndRepairJob?: () => void;
  isLoading?: boolean;
}) => [
  {
    id: 1,
    content: (
      <DeleteModal
        description={DEFAULT_DELETE_MODAL_DESCRIPTION}
        isLoading={isLoading}
        isOpen={isDeleteEventModalOpen}
        title={DEFAULT_DELETE_MODAL_TITLE}
        onClose={onCloseDeleteEventModal}
        onSubmit={onDeleteCalendarEventAndRepairJob}
      />
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
