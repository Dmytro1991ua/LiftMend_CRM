import { useCallback } from 'react';

import { HiClipboardCheck } from 'react-icons/hi';

import { Button } from '@/components/ui/button';
import BaseModal from '@/shared/base-modal';
import ModalFooter from '@/shared/base-modal/modal-footer';
import { useModal } from '@/shared/hooks';

import { useCompleteElevatorInspection } from '../../hooks';

export type CompleteElevatorInspectionCellProps = {
  elevatorId: string;
  status: string;
};

export const COMPLETE_ELEVATOR_INSPECTION_MODAL_MESSAGE =
  'Mark this elevator as inspected today?. Last inspection will be set to today, next inspection scheduled in 6 months, and inspection status will be updated accordingly.';

const CompleteElevatorInspectionCell = ({ elevatorId, status }: CompleteElevatorInspectionCellProps) => {
  const { isModalOpen, onCloseModal, onOpenModal } = useModal();
  const { isLoading, onCompleteElevatorInspection } = useCompleteElevatorInspection();

  const isElevatorOperational = status !== 'Out of Service';

  const onHandleCompleteElevatorInspection = useCallback(async () => {
    const result = await onCompleteElevatorInspection?.(elevatorId);

    if (!result?.errors?.length) onCloseModal();
  }, [onCompleteElevatorInspection, onCloseModal, elevatorId]);

  const onHandleCompleteInspectionIconClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      onOpenModal();
    },
    [onOpenModal]
  );

  return (
    <section className='flex justify-center items-center'>
      <Button
        className='hover:bg-transparent'
        data-testid='complete-elevator-inspection-btn'
        disabled={!isElevatorOperational}
        variant='ghost'
        onClick={onHandleCompleteInspectionIconClick}
      >
        <HiClipboardCheck className='h-6 w-6 text-primary' data-testid='complete-inspection-icon' />
      </Button>
      <BaseModal
        isOpen={isModalOpen}
        modalFooter={
          <ModalFooter
            cancelButtonLabel='No'
            isDisabled={isLoading}
            isLoading={isLoading}
            submitButtonLabel='Yes'
            onCancel={onCloseModal}
            onSubmit={onHandleCompleteElevatorInspection}
          />
        }
        title='Complete Inspection'
        onClose={onCloseModal}
      >
        <h3>{COMPLETE_ELEVATOR_INSPECTION_MODAL_MESSAGE}</h3>
      </BaseModal>
    </section>
  );
};

export default CompleteElevatorInspectionCell;
