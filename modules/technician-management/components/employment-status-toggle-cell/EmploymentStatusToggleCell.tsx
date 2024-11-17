import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import BaseModal from '@/shared/base-modal';
import ModalFooter from '@/shared/base-modal/modal-footer';
import { useModal } from '@/shared/hooks';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';

import { EmploymentStatus } from '../../types';

import { EMPLOYMENT_STATUS_UPDATE_CONFIG } from './config';
import useUpdateTechnicianVisibility from './hooks/useUpdateTechnicianVisibility';

type EmploymentStatusToggleCellProps = {
  employmentStatus: EmploymentStatus;
  technicianId: string;
  availabilityStatus: string;
};

const EmploymentStatusToggleCell = ({ employmentStatus, technicianId }: EmploymentStatusToggleCellProps) => {
  const { isModalOpen, onCloseModal, onOpenModal } = useModal();
  const { onError, onSuccess } = useMutationResultToasts();

  const { loading, onUpdateEmploymentStatus } = useUpdateTechnicianVisibility({
    onError,
    onSuccess,
  });

  const config = EMPLOYMENT_STATUS_UPDATE_CONFIG[employmentStatus];

  const onHandleEmploymentStatusChange = useCallback(async () => {
    await onUpdateEmploymentStatus(technicianId, config.newEmploymentStatus, config.newAvailabilityStatus);

    onCloseModal();
  }, [config.newEmploymentStatus, config.newAvailabilityStatus, onCloseModal, onUpdateEmploymentStatus, technicianId]);

  return (
    <section>
      <Button className='hover:bg-transparent' variant='ghost' onClick={onOpenModal}>
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
