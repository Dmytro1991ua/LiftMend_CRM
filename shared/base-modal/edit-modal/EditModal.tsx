import BaseModal from '@/shared/base-modal';
import ModalFooter from '@/shared/base-modal/modal-footer';
import { BaseModalProps } from '@/shared/base-modal/types';

const EditModal = ({
  isOpen,
  isLoading,
  isDisabled,
  onClose,
  onSubmit,
  title,
  children,
  cancelButtonLabel = 'Cancel',
  submitButtonLabel = 'Edit',
}: BaseModalProps) => {
  return (
    <BaseModal
      isOpen={isOpen}
      modalFooter={
        <ModalFooter
          cancelButtonLabel={cancelButtonLabel}
          isDisabled={isDisabled}
          isLoading={isLoading}
          submitButtonLabel={submitButtonLabel}
          onCancel={onClose}
          onSubmit={onSubmit}
        />
      }
      title={title}
      onClose={onClose}>
      {children}
    </BaseModal>
  );
};

export default EditModal;
