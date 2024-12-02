import { Button } from '@/components/ui/button';
import BaseModal from '@/shared/base-modal';
import ModalFooter from '@/shared/base-modal/modal-footer';

import useUpdateEmploymentStatus from '../../hooks/useUpdateEmploymentStatus';
import { EmploymentStatus } from '../../types';

type EmploymentStatusToggleCellProps = {
  employmentStatus: EmploymentStatus;
  technicianId: string;
  availabilityStatus: string;
};

const EmploymentStatusToggleCell = ({ employmentStatus, technicianId }: EmploymentStatusToggleCellProps) => {
  const { loading, config, isModalOpen, onHandleEmploymentStatusChange, onOpenModal, onCloseModal } =
    useUpdateEmploymentStatus({
      employmentStatus,
      technicianId,
    });

  return (
    <section>
      <Button
        className='hover:bg-transparent'
        variant='ghost'
        onClick={(e) => {
          e.stopPropagation();

          onOpenModal();
        }}
      >
        {config.icon}
      </Button>
      <BaseModal
        isOpen={isModalOpen}
        modalFooter={
          <ModalFooter
            cancelButtonLabel='No'
            isDisabled={loading}
            isLoading={loading}
            submitButtonLabel='Yes'
            onCancel={onCloseModal}
            onSubmit={onHandleEmploymentStatusChange}
          />
        }
        title={config.modalTitle}
        onClose={onCloseModal}
      >
        {config.modalMessage}
      </BaseModal>
    </section>
  );
};

export default EmploymentStatusToggleCell;
