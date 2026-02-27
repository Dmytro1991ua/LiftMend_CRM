import BaseEntityStatusTrigger from '@/shared/base-entity-status-trigger';

import { useUpdateEmploymentStatus } from '../../hooks';
import { EmploymentStatus } from '../../types';
import { STATUS_ICON_TOOLTIP_MESSAGE } from '../technician-management-table/constants';

export type EmploymentStatusToggleCellProps = {
  employmentStatus: EmploymentStatus;
  technicianId: string;
  availabilityStatus: string | null;
  lastKnownAvailabilityStatus?: string | null;
  variant?: 'icon' | 'button';
};

const EmploymentStatusToggleCell = ({
  employmentStatus,
  availabilityStatus,
  technicianId,
  lastKnownAvailabilityStatus,
  variant = 'icon',
}: EmploymentStatusToggleCellProps) => {
  const isTooltipShown = employmentStatus !== 'Inactive';
  const iconColorClass = variant === 'icon' ? 'h-5 w-5 text-primary' : 'h-3 w-3 text-white';

  const { loading, config, isModalOpen, onHandleEmploymentStatusChange, onOpenModal, onCloseModal } =
    useUpdateEmploymentStatus({
      employmentStatus,
      technicianId,
      availabilityStatus,
      lastKnownAvailabilityStatus,
      iconColorClass,
    });

  return (
    <BaseEntityStatusTrigger
      buttonIcon={config.icon}
      buttonLabel='Complete'
      isLoading={loading}
      isModalOpen={isModalOpen}
      isTooltipShown={isTooltipShown}
      modalMessage={config.modalMessage}
      modalTitle={config.modalTitle}
      tooltipMessage={STATUS_ICON_TOOLTIP_MESSAGE}
      variant={variant}
      onCloseModal={onCloseModal}
      onConfirm={onHandleEmploymentStatusChange}
      onOpenModal={onOpenModal}
    />
  );
};

export default EmploymentStatusToggleCell;
