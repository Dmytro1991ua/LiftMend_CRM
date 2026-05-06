import React, { useMemo } from 'react';

import { FormProvider } from 'react-hook-form';
import { FaCheck } from 'react-icons/fa';

import BaseEntityStatusTrigger from '@/shared/base-entity-status-trigger';
import ControlledSingleFileUpload from '@/shared/base-file-upload/controlled-single-file-upload';
import FileUploadPreview from '@/shared/base-file-upload/file-upload-preview';
import { RepairJob } from '@/shared/types';

import { COMPLETE_REPAIR_JOB_MODAL_DESCRIPTION } from './constant';
import ControlledChecklist from './controlled-checklist';
import ControlledInventoryPartsList from './controlled-inventory-parts-list';
import { useCompleteRepairJob, useGetInventoryPartsDropdownOptions } from './hooks';
import { getCompleteButtonDisabledState } from './utils';

export type CompleteRepairJobProps = {
  repairJob: RepairJob;
  variant?: 'icon' | 'button';
};

const CompleteRepairJob = ({ repairJob, variant = 'icon' }: CompleteRepairJobProps) => {
  const { isCompleteButtonDisabled, tooltipMessage } =
    getCompleteButtonDisabledState(repairJob.status)[repairJob.status] || {};

  const { formState, isModalOpen, onOpenModal, onHandleCloseModal, onHandleComplete, isLoading } =
    useCompleteRepairJob(repairJob);

  const shouldFetchInventoryParts = isModalOpen && !isCompleteButtonDisabled;

  const { inventoryPartsOptions, isLoading: isInventoryPartsOptionsLoading } = useGetInventoryPartsDropdownOptions(
    !shouldFetchInventoryParts
  );

  const file = formState.watch('evidencePhoto');
  const previewImage = useMemo(() => {
    if (!file) return null;

    return URL.createObjectURL(file);
  }, [file]);

  const iconColorClass = variant === 'icon' ? 'h-5 w-5 text-primary' : 'h-3 w-3 text-white';

  return (
    <BaseEntityStatusTrigger
      buttonIcon={<FaCheck className={iconColorClass} data-testid='complete-icon' />}
      buttonLabel='Complete'
      isButtonDisabled={isCompleteButtonDisabled}
      isLoading={isLoading}
      isModalOpen={isModalOpen}
      isTooltipShown={!isCompleteButtonDisabled}
      modalContentClassName='h-[60rem] 2xl:h-[68rem]'
      modalMessage={COMPLETE_REPAIR_JOB_MODAL_DESCRIPTION}
      modalTitle='Complete Repair Job'
      tooltipMessage={tooltipMessage}
      variant={variant}
      wrapperClassName='flex justify-center items-center'
      onCloseModal={onHandleCloseModal}
      onConfirm={formState.handleSubmit(onHandleComplete)}
      onOpenModal={onOpenModal}
    >
      <FormProvider {...formState}>
        <ControlledSingleFileUpload
          className='mb-8'
          clearErrors={formState.clearErrors}
          label='Photo Evidence (After)'
          name='evidencePhoto'
        >
          <FileUploadPreview previewImage={previewImage} onRemove={() => formState.resetField('evidencePhoto')} />
        </ControlledSingleFileUpload>
        <ControlledChecklist
          isDisabled={isLoading}
          label='Completion Checklist'
          name='checklist'
          wrapperClassname='h-[33rem] overflow-auto'
        />
        <ControlledInventoryPartsList
          isDisabled={isInventoryPartsOptionsLoading}
          label='Inventory Used'
          name='partsUsed'
          options={inventoryPartsOptions}
        />
      </FormProvider>
    </BaseEntityStatusTrigger>
  );
};

export default CompleteRepairJob;
