import { Button } from '@/components/ui/button';
import BaseModal from '@/shared/base-modal';
import ModalFooter from '@/shared/base-modal/modal-footer';
import BaseTooltip from '@/shared/base-tooltip/BaseTooltip';

import { ElevatorStatus } from '../../types';

import { STATUS_ICON_TOOLTIP_MESSAGE } from './constants';
import useUpdateElevatorRecordStatus from './hooks/useUpdateElevatorRecordStatus';

export type ElevatorStatusToggleCellProps = {
  status: ElevatorStatus;
  lastKnownStatus?: string | null;
  elevatorRecordId: string;
};

const ElevatorStatusToggleCell = ({ status, elevatorRecordId, lastKnownStatus }: ElevatorStatusToggleCellProps) => {
  const { loading, isModalOpen, config, onCloseModal, onOpenModal, onHandleElevatorRecordStatusChange } =
    useUpdateElevatorRecordStatus({
      elevatorRecordId,
      lastKnownStatus,
      status,
    });

  const isTooltipShown = status !== 'Out of Service';

  return (
    <section>
      <Button
        className='relative hover:bg-transparent'
        data-testid='status-toggle-btn'
        variant='ghost'
        onClick={(e) => {
          e.stopPropagation();

          onOpenModal();
        }}
      >
        <BaseTooltip
          className='w-[30rem] !shadow-none'
          disable={isTooltipShown}
          id='elevator-toggle-status-cell-tooltip'
          message={STATUS_ICON_TOOLTIP_MESSAGE}
          place='left'
        >
          <div data-testid={config.dataTestId}>{config.icon}</div>
        </BaseTooltip>
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
            onSubmit={onHandleElevatorRecordStatusChange}
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

export default ElevatorStatusToggleCell;
