import BaseModal from '@/shared/base-modal';
import ModalFooter from '@/shared/base-modal/modal-footer';
import { BaseModalProps } from '@/shared/base-modal/types';

const EditModal = ({ isOpen, isLoading, isDisabled, onClose, onSubmit, title, children }: BaseModalProps) => {
  return (
    <BaseModal
      isOpen={isOpen}
      modalFooter={
        <ModalFooter
          cancelButtonLabel='Cancel'
          isDisabled={isDisabled}
          isLoading={isLoading}
          submitButtonLabel='Edit'
          onCancel={onClose}
          onSubmit={onSubmit}
        />
      }
      title={title}
      onClose={onClose}
    >
      {children}
    </BaseModal>
  );
};

export default EditModal;
