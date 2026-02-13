import React from 'react';

import { FormProvider } from 'react-hook-form';
import { FaCheck } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import EditModal from '@/shared/base-modal/edit-modal/EditModal';
import BaseTooltip from '@/shared/base-tooltip';
import { RepairJob } from '@/shared/types';

import { COMPLETE_REPAIR_JOB_MODAL_DESCRIPTION } from './constant';
import ControlledChecklist from './controlled-checklist';
import { useCompleteRepairJob } from './hooks';
import { getCompleteButtonDisabledState } from './utils';

export type CompleteRepairJobProps = {
  repairJob: RepairJob;
  variant?: 'icon' | 'button';
};

const CompleteRepairJob = ({ repairJob, variant = 'icon' }: CompleteRepairJobProps) => {
  const { formState, isModalOpen, onHandleCompleteButtonClick, onHandleCloseModal, onHandleComplete, isLoading } =
    useCompleteRepairJob(repairJob);

  const isIconOnly = variant === 'icon';
  const buttonVariant = isIconOnly ? 'ghost' : 'default';
  const shouldShowText = variant === 'button';
  const iconColorClass = isIconOnly ? 'h-5 w-5 text-primary' : 'h-3 w-3 text-white';

  const { isCompleteButtonDisabled, tooltipMessage } =
    getCompleteButtonDisabledState(repairJob.status)[repairJob.status] || {};

  return (
    <section className='flex justify-center items-center'>
      <BaseTooltip
        shouldRenderInPortal
        className='w-[33rem] !shadow-none'
        disable={!isCompleteButtonDisabled}
        id='complete-button-id'
        message={tooltipMessage}
        place='left'
      >
        <Button
          className={isIconOnly ? 'hover:bg-transparent' : ''}
          disabled={isCompleteButtonDisabled}
          variant={buttonVariant}
          onClick={onHandleCompleteButtonClick}
        >
          <FaCheck className={iconColorClass} data-testid='complete-icon' />
          {shouldShowText && <span className='ml-2'>Complete</span>}
        </Button>
      </BaseTooltip>
      <FormProvider {...formState}>
        <EditModal
          isDisabled={isLoading}
          isLoading={isLoading}
          isOpen={isModalOpen}
          submitButtonLabel='Complete'
          title='Complete repair job'
          onClose={onHandleCloseModal}
          onSubmit={formState.handleSubmit(onHandleComplete)}
        >
          <p className='mb-4 text-sm text-muted-foreground'>{COMPLETE_REPAIR_JOB_MODAL_DESCRIPTION}</p>
          <ControlledChecklist isDisabled={isLoading} name='checklist' />
        </EditModal>
      </FormProvider>
    </section>
  );
};

export default CompleteRepairJob;
