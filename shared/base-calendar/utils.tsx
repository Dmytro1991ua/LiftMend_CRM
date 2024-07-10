import { FaEdit, FaTrash } from 'react-icons/fa';

import BaseModal from '@/shared/base-modal';
import ModalFooter from '@/shared/base-modal/modal-footer';

import { DEFAULT_CREATE_MODAL_TITLE, DEFAULT_DELETE_MODAL_TITLE } from './constants';

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

export const getEventModalsConfig = (isDeleteEventModalOpen: boolean, onCloseDeleteEventModalOpen: () => void) => [
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

export const getCalendarModalsConfig = (isCreateEventModalOpen: boolean, onCloseCreateEventModalOpen: () => void) => [
  {
    id: 1,
    content: (
      <BaseModal
        isOpen={isCreateEventModalOpen}
        modalFooter={
          <ModalFooter
            cancelButtonLabel='Cancel'
            submitButtonLabel='Submit'
            onCancel={onCloseCreateEventModalOpen}
            onSubmit={onCloseCreateEventModalOpen}
          />
        }
        title={DEFAULT_CREATE_MODAL_TITLE}
        onClose={onCloseCreateEventModalOpen}>
        <p>Test</p>
      </BaseModal>
    ),
  },
];
