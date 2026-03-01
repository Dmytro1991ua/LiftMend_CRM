import { FormProvider } from 'react-hook-form';

import BaseEntityStatusTrigger from '@/shared/base-entity-status-trigger';
import ControlledSingleSelect from '@/shared/base-select/components/controlled-single-select';
import {
  PREDEFINED_DROPDOWN_OPTIONS_CONFIG,
  PredefinedDropdownOptions,
} from '@/shared/hooks/useFetchDropdownOptions/config';

import { useUpdateEmploymentStatus } from '../../hooks';
import { EmploymentStatus } from '../../types';
import { STATUS_ICON_TOOLTIP_MESSAGE } from '../technician-management-table/constants';

import { TechnicianStatusFormValues } from './types';

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
  const isTechnicianActive = employmentStatus !== 'Inactive';
  const iconColorClass = variant === 'icon' ? 'h-5 w-5 text-primary' : 'h-3 w-3 text-white';

  const { loading, config, isModalOpen, formState, onHandleEmploymentStatusChange, onOpenModal, onCloseModal } =
    useUpdateEmploymentStatus({
      employmentStatus,
      technicianId,
      availabilityStatus,
      lastKnownAvailabilityStatus,
      iconColorClass,
    });

  const { clearErrors, handleSubmit } = formState;

  return (
    <BaseEntityStatusTrigger
      buttonIcon={config.icon}
      buttonLabel={config.label}
      isLoading={loading}
      isModalOpen={isModalOpen}
      isTooltipShown={isTechnicianActive}
      modalMessage={config.modalMessage}
      modalTitle={config.modalTitle}
      tooltipMessage={STATUS_ICON_TOOLTIP_MESSAGE}
      variant={variant}
      onCloseModal={onCloseModal}
      onConfirm={handleSubmit(onHandleEmploymentStatusChange)}
      onOpenModal={onOpenModal}
    >
      {isTechnicianActive && (
        <FormProvider {...formState}>
          <ControlledSingleSelect<TechnicianStatusFormValues>
            captureMenuScroll={false}
            className='mb-6'
            clearErrors={clearErrors}
            isMultiSelect={false}
            label='Reason for Deactivation'
            name='deactivationReason'
            options={PREDEFINED_DROPDOWN_OPTIONS_CONFIG[PredefinedDropdownOptions.TechnicianInactivationReason]}
            placeholder='Select Technician Deactivation Reason'
          />
        </FormProvider>
      )}
    </BaseEntityStatusTrigger>
  );
};

export default EmploymentStatusToggleCell;
