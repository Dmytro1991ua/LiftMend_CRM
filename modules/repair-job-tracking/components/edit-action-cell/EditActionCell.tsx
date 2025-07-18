import React, { useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider } from 'react-hook-form';
import { FaEdit } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import EditModal from '@/shared/base-modal/edit-modal/EditModal';
import { getModalTitle } from '@/shared/base-modal/edit-modal/utils';
import BaseTooltip from '@/shared/base-tooltip';
import { useFormState, useModal } from '@/shared/hooks';
import { getEditButtonDisabledState } from '@/shared/repair-job/config';
import EditRepairJobForm from '@/shared/repair-job/edit-repair-job-form';
import { RepairJobFormValues } from '@/shared/repair-job/edit-repair-job-form/types';
import { repairJobEditFormSchema } from '@/shared/repair-job/edit-repair-job-form/validation';
import { useRepairJobFormHandler } from '@/shared/repair-job/hooks';
import { convertRepairJobToFormValues } from '@/shared/repair-job/repair-job-details/utils';
import { RepairJob } from '@/shared/types';
import { getCalendarEventInfo } from '@/shared/utils';

export type EditActionCellProps = {
  repairJob: RepairJob;
};

const EditActionCell = ({ repairJob }: EditActionCellProps) => {
  const { isModalOpen, onCloseModal, onOpenModal } = useModal();

  const currentRepairJob = useMemo(() => convertRepairJobToFormValues(repairJob), [repairJob]);

  const { formState, onReset } = useFormState<RepairJobFormValues>({
    initialValues: currentRepairJob,
    onCloseModal,
    resolver: zodResolver(repairJobEditFormSchema),
  });

  const { title } = getCalendarEventInfo({
    elevatorType: repairJob.elevatorType,
    elevatorLocation: repairJob.elevatorLocation,
    buildingName: repairJob.buildingName,
    jobType: repairJob.jobType,
  });

  const { onEditRepairJob, isEditRepairJobLoading } = useRepairJobFormHandler({ repairJob, onReset });

  const { isEditButtonDisabled, tooltipMessage } = useMemo(
    () => getEditButtonDisabledState(repairJob.status)[repairJob.status] || {},
    [repairJob.status]
  );

  const onHandleEditClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    onOpenModal();
  };

  return (
    <FormProvider {...formState}>
      <section className='flex justify-center items-center'>
        <BaseTooltip
          shouldRenderInPortal
          className='w-[33rem]'
          disable={!isEditButtonDisabled}
          id='edit-button-tooltip'
          message={tooltipMessage}
          place='left'>
          <Button
            className='hover:bg-transparent'
            disabled={isEditButtonDisabled}
            variant='ghost'
            onClick={onHandleEditClick}>
            <FaEdit className='h-5 w-5 text-primary' data-testid='edit-icon' />
          </Button>
        </BaseTooltip>
        <EditModal
          isDisabled={!formState.formState.isDirty || isEditRepairJobLoading}
          isLoading={isEditRepairJobLoading}
          isOpen={isModalOpen}
          title={getModalTitle(title, true)}
          onClose={onCloseModal}
          onSubmit={formState.handleSubmit(onEditRepairJob)}>
          <EditRepairJobForm repairJobFormValues={currentRepairJob} />
        </EditModal>
      </section>
    </FormProvider>
  );
};

export default EditActionCell;
