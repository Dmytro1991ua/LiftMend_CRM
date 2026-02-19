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

import { ElevatorStatus } from '../../types';

import { STATUS_ICON_TOOLTIP_MESSAGE } from './constants';
import useUpdateElevatorRecordStatus from './hooks/useUpdateElevatorRecordStatus';
import { ElevatorStatusFormValues } from './types';

export type ElevatorStatusToggleCellProps = {
  status: ElevatorStatus;
  lastKnownStatus?: string | null;
  elevatorRecordId: string;
};

const ElevatorStatusToggleCell = ({ status, elevatorRecordId, lastKnownStatus }: ElevatorStatusToggleCellProps) => {
  const { loading, isModalOpen, config, formState, onCloseModal, onOpenModal, onHandleElevatorRecordStatusChange } =
    useUpdateElevatorRecordStatus({
      elevatorRecordId,
      lastKnownStatus,
      status,
    });

  const { clearErrors, handleSubmit } = formState;

  const isElevatorOperational = status !== 'Out of Service';

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
          disable={isElevatorOperational}
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
