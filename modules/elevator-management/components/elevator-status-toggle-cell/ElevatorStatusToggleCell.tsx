import { FormProvider } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import BaseModal from '@/shared/base-modal';
import ModalFooter from '@/shared/base-modal/modal-footer';
import ControlledSingleSelect from '@/shared/base-select/components/controlled-single-select';
import BaseTooltip from '@/shared/base-tooltip/BaseTooltip';
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
  const buttonVariant = isIconOnly ? 'ghost' : 'default';
  const shouldShowText = variant === 'button';
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
    <section>
      <BaseTooltip
        className='w-[30rem] !shadow-none'
        disable={isElevatorOperational}
        id='elevator-toggle-status-cell-tooltip'
        message={STATUS_ICON_TOOLTIP_MESSAGE}
        place='left'
      >
        <Button
          className={isIconOnly ? 'hover:bg-transparent' : ''}
          data-testid='status-toggle-btn'
          variant={buttonVariant}
          onClick={(e) => {
            e.stopPropagation();

            onOpenModal();
          }}
        >
          <div data-testid={config.dataTestId}>{config.icon}</div>
          {shouldShowText && <span className='ml-2'>{config.label}</span>}
        </Button>
      </BaseTooltip>
      <BaseModal
        isOpen={isModalOpen}
        modalFooter={
          <ModalFooter
            cancelButtonLabel='No'
            isDisabled={loading}
            isLoading={loading}
            submitButtonLabel='Yes'
            onCancel={onCloseModal}
            onSubmit={handleSubmit(onHandleElevatorRecordStatusChange)}
          />
        }
        title={config.modalTitle}
        onClose={onCloseModal}
      >
        <h3 className={cn(isElevatorOperational ? 'mb-8' : 'mb-0')}>{config.modalMessage}</h3>
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
      </BaseModal>
    </section>
  );
};

export default ElevatorStatusToggleCell;
