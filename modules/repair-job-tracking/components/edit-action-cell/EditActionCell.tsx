import React from 'react';

import { FormProvider } from 'react-hook-form';
import { FaEdit } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { getModalTitle } from '@/modules/repair-job-details/utils';
import EditModal from '@/shared/base-modal/edit-modal/EditModal';
import { useModal } from '@/shared/hooks';
import EditRepairJobForm from '@/shared/repair-job/edit-repair-job-form';
import useRepairJobDetailsFormState from '@/shared/repair-job/hooks/useRepairJobDetailsFormState';
import useRepairJobFormHandler from '@/shared/repair-job/hooks/useRepairJobFormHandler';
import { getCalendarEventInfo } from '@/shared/utils';

import { RepairJob } from '../repair-job-table/columns';

type EditActionCellProps = {
  repairJob: RepairJob;
};

const EditActionCell = ({ repairJob }: EditActionCellProps) => {
  const { isModalOpen, onCloseModal, onOpenModal } = useModal();

  const { repairJobFormState, onReset } = useRepairJobDetailsFormState({ repairJob, onCloseModal });

  const { title } = getCalendarEventInfo({
    elevatorType: repairJob.elevatorType,
    elevatorLocation: repairJob.elevatorLocation,
    buildingName: repairJob.buildingName,
    jobType: repairJob.jobType,
  });

  const { onEditRepairJob, isEditRepairJobLoading } = useRepairJobFormHandler({ repairJob, onReset });

  const onHandleEditClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    onOpenModal();
  };

  return (
    <FormProvider {...repairJobFormState}>
      <section className='flex justify-center items-center'>
        <Button className='hover:bg-transparent' variant='ghost' onClick={onHandleEditClick}>
          <FaEdit className='h-5 w-5 text-primary' />
        </Button>
        <EditModal
          isDisabled={!repairJobFormState.formState.isDirty || isEditRepairJobLoading}
          isOpen={isModalOpen}
          title={getModalTitle(title, true)}
          onClose={onCloseModal}
          onSubmit={repairJobFormState.handleSubmit(onEditRepairJob)}
        >
          <EditRepairJobForm repairJob={repairJob} />
        </EditModal>
      </section>
    </FormProvider>
  );
};

export default EditActionCell;
