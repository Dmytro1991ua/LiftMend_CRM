import { useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider } from 'react-hook-form';
import { FaEdit } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import EditModal from '@/shared/base-modal/edit-modal';
import { useFormState, useModal } from '@/shared/hooks';
import { TechnicianRecord } from '@/shared/types';

import { TechnicianRecordFormValues } from '../../types';
import { convertTechnicianRecordToFormValues } from '../../utils';
import EditTechnicianRecordForm from '../edit-technician-record-form';
import { technicianRecordEditFormSchema } from '../edit-technician-record-form/validation';
import { useEditTechnicianRecordForm } from '../technician-record-form/hooks';

export type EditActionCellProps = {
  technicianRecord: TechnicianRecord;
};

const EditActionCell = ({ technicianRecord }: EditActionCellProps) => {
  const { isModalOpen, onCloseModal, onOpenModal } = useModal();

  const currentTechnicianRecord = useMemo(
    () => convertTechnicianRecordToFormValues(technicianRecord),
    [technicianRecord]
  );

  const { formState, onReset } = useFormState<TechnicianRecordFormValues>({
    initialValues: currentTechnicianRecord,
    onCloseModal,
    resolver: zodResolver(technicianRecordEditFormSchema),
  });

  const { isUpdateRecordLoading, onEditTechnicianRecord } = useEditTechnicianRecordForm({ onReset, technicianRecord });

  const isDeleteButtonDisabled = technicianRecord.employmentStatus !== 'Active';

  const onHandleEditClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    onOpenModal();
  };

  return (
    <FormProvider {...formState}>
      <section className='flex justify-center items-center'>
        <Button
          className='hover:bg-transparent'
          disabled={isDeleteButtonDisabled}
          variant='ghost'
          onClick={onHandleEditClick}>
          <FaEdit className='h-5 w-5 text-primary' data-testid='edit-icon' />
        </Button>
        <EditModal
          isDisabled={!formState.formState.isDirty || isUpdateRecordLoading}
          isOpen={isModalOpen}
          title={`${technicianRecord.name} record`}
          onClose={onCloseModal}
          onSubmit={formState.handleSubmit(onEditTechnicianRecord)}>
          <EditTechnicianRecordForm technicianRecordFormValues={currentTechnicianRecord} />
        </EditModal>
      </section>
    </FormProvider>
  );
};

export default EditActionCell;
