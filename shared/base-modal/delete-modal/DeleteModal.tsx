import BaseModal from '../BaseModal';
import ModalFooter from '../modal-footer';
import { BaseModalProps } from '../types';

const DeleteModal = ({ isOpen, isLoading, title, description, onClose, onSubmit }: BaseModalProps) => {
  return (
    <BaseModal
      isOpen={isOpen}
      modalFooter={
        <ModalFooter
          cancelButtonLabel='Cancel'
          isLoading={isLoading}
          submitButtonLabel='Ok'
          onCancel={onClose}
          onSubmit={onSubmit}
        />
      }
      title={title}
      onClose={onClose}>
      {description}
    </BaseModal>
  );
};

export default DeleteModal;
