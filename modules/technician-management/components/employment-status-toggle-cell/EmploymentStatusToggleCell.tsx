import { Button } from '@/components/ui/button';
import BaseModal from '@/shared/base-modal';
import ModalFooter from '@/shared/base-modal/modal-footer';
import BaseTooltip from '@/shared/base-tooltip';

import useUpdateEmploymentStatus from '../../hooks/useUpdateEmploymentStatus';
import { EmploymentStatus } from '../../types';
import { STATUS_ICON_TOOLTIP_MESSAGE } from '../technician-management-table/constants';

type EmploymentStatusToggleCellProps = {
  employmentStatus: EmploymentStatus;
  technicianId: string;
  availabilityStatus: string;
  lastKnownAvailabilityStatus?: string | null;
};

const EmploymentStatusToggleCell = ({
  employmentStatus,
  availabilityStatus,
  technicianId,
  lastKnownAvailabilityStatus,
}: EmploymentStatusToggleCellProps) => {
  const { loading, config, isModalOpen, onHandleEmploymentStatusChange, onOpenModal, onCloseModal } =
    useUpdateEmploymentStatus({
      employmentStatus,
      technicianId,
      availabilityStatus,
      lastKnownAvailabilityStatus,
    });

  const isTooltipShown = employmentStatus !== 'Inactive';

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
        <BaseTooltip
          className='w-[30rem] shadow-none'
          disable={isTooltipShown}
          id='employment-toggle-status-cell-tooltip'
          message={STATUS_ICON_TOOLTIP_MESSAGE}
          place='left'
        >
          {config.icon}
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
