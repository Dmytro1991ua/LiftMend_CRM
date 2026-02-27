import { FormProvider } from 'react-hook-form';

import BaseEntityStatusTrigger from '@/shared/base-entity-status-trigger';
import ControlledSingleSelect from '@/shared/base-select/components/controlled-single-select';
import {
  PREDEFINED_DROPDOWN_OPTIONS_CONFIG,
  PredefinedDropdownOptions,
} from '@/shared/hooks/useFetchDropdownOptions/config';
import { ElevatorRecord } from '@/shared/types';

import { STATUS_ICON_TOOLTIP_MESSAGE } from './constants';
import useUpdateElevatorRecordStatus from './hooks/useUpdateElevatorRecordStatus';
import { ElevatorStatusFormValues } from './types';

export type ElevatorStatusToggleCellProps = {
  elevatorRecord: ElevatorRecord;
  variant?: 'icon' | 'button';
};

const ElevatorStatusToggleCell = ({ variant = 'icon', elevatorRecord }: ElevatorStatusToggleCellProps) => {
  const { status, id, lastKnownStatus } = elevatorRecord;

  const isElevatorOperational = status !== 'Out of Service';
  const isIconOnly = variant === 'icon';
  const iconColorClass = isIconOnly ? 'h-6 w-6 text-primary' : 'h-3 w-3 text-white';

  const { loading, isModalOpen, config, formState, onCloseModal, onOpenModal, onHandleElevatorRecordStatusChange } =
    useUpdateElevatorRecordStatus({
      elevatorRecordId: id,
      lastKnownStatus,
      status,
      iconColorClass,
    });

  const { clearErrors, handleSubmit } = formState;

  return (
    <BaseEntityStatusTrigger
      buttonIcon={config.icon}
      buttonIconTestId={config.dataTestId}
      buttonLabel={config.label}
      isLoading={loading}
      isModalOpen={isModalOpen}
      isTooltipShown={isElevatorOperational}
      modalMessage={config.modalMessage}
      modalTitle={config.modalTitle}
      tooltipMessage={STATUS_ICON_TOOLTIP_MESSAGE}
      variant={variant}
      onCloseModal={onCloseModal}
      onConfirm={handleSubmit(onHandleElevatorRecordStatusChange)}
      onOpenModal={onOpenModal}
    >
      {isElevatorOperational && (
        <FormProvider {...formState}>
          <ControlledSingleSelect<ElevatorStatusFormValues>
            captureMenuScroll={false}
            className='mb-6'
            clearErrors={clearErrors}
            isMultiSelect={false}
            label='Reason for Deactivation'
            name='deactivationReason'
            options={PREDEFINED_DROPDOWN_OPTIONS_CONFIG[PredefinedDropdownOptions.ElevatorDeactivationReason]}
            placeholder='Select Elevator Deactivation Reason'
          />
        </FormProvider>
      )}
    </BaseEntityStatusTrigger>
  );
};

export default ElevatorStatusToggleCell;
