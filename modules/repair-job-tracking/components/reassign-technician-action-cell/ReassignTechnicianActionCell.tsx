import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider } from 'react-hook-form';
import { MdAssignmentAdd } from 'react-icons/md';

import { Button } from '@/components/ui/button';
import EditModal from '@/shared/base-modal/edit-modal';
import BaseTooltip from '@/shared/base-tooltip';
import { useModal } from '@/shared/hooks';
import useFormState from '@/shared/hooks/useFormState';
import { ReassignTechnicianFormValues } from '@/shared/repair-job/edit-repair-job-form/types';
import useReassignTechnicianFormHandler from '@/shared/repair-job/hooks/useReassignTechnicianFormHandler';
import { RepairJob } from '@/shared/types';

import { REASSIGN_TECHNICIAN_BUTTON_TOOLTIP_MESSAGE } from './constants';
import ReassignTechnicianForm from './reassign-technician-form/ReassignTechnicianForm';
import {
  INITIAL_REASSIGN_TECHNICIAN_VALUES,
  technicianReassignmentSchema,
} from './reassign-technician-form/validation';

type ReassignTechnicianActionCellProps = {
  repairJob: RepairJob;
};

const ReassignTechnicianActionCell = ({ repairJob }: ReassignTechnicianActionCellProps) => {
  const { isModalOpen, onCloseModal, onOpenModal } = useModal();

  const { formState, onReset } = useFormState<ReassignTechnicianFormValues>({
    initialValues: INITIAL_REASSIGN_TECHNICIAN_VALUES,
    onCloseModal,
    resolver: zodResolver(technicianReassignmentSchema),
  });

  const { onHandleTechnicianReassignment, isReassignTechnicianLoading } = useReassignTechnicianFormHandler({
    repairJob,
    onReset,
  });

  const isReassignTechnicianButtonDisabled = repairJob.status === 'Cancelled' || repairJob.status === 'Completed';

  const onHandleReassignTechnicianClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    onOpenModal();
  };

  return (
    <FormProvider {...formState}>
      <section className='flex justify-center items-center'>
        <BaseTooltip
          shouldRenderInPortal
          className='w-[33rem]'
          disable={!isReassignTechnicianButtonDisabled}
          id='reassign-technician'
          message={REASSIGN_TECHNICIAN_BUTTON_TOOLTIP_MESSAGE}
          place='left'>
          <Button
            className='hover:bg-transparent'
            disabled={isReassignTechnicianButtonDisabled}
            variant='ghost'
            onClick={onHandleReassignTechnicianClick}>
            <MdAssignmentAdd className='h-5 w-5 text-primary' />
          </Button>
        </BaseTooltip>
        <EditModal
          isDisabled={!formState.formState.isDirty || isReassignTechnicianLoading}
          isLoading={isReassignTechnicianLoading}
          isOpen={isModalOpen}
          title='Reassign Technician'
          onClose={onCloseModal}
          onSubmit={formState.handleSubmit(onHandleTechnicianReassignment)}>
          <ReassignTechnicianForm repairJob={repairJob} />
        </EditModal>
      </section>
    </FormProvider>
  );
};

export default ReassignTechnicianActionCell;
