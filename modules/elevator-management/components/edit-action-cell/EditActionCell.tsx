import { useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider } from 'react-hook-form';
import { FaEdit } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import EditModal from '@/shared/base-modal/edit-modal';
import { getModalTitle } from '@/shared/base-modal/edit-modal/utils';
import { useFormState, useModal } from '@/shared/hooks';
import { ElevatorRecord } from '@/shared/types';
import { getElevatorRecordInfo } from '@/shared/utils';

import { ElevatorRecordFormValues } from '../../types';
import { convertElevatorRecordToFormValues } from '../../utils';
import EditElevatorRecordForm from '../edit-elevator-record-form';
import useEditElevatorRecordForm from '../edit-elevator-record-form/hooks/useEditElevatorRecordForm';
import { elevatorRecordEditFormSchema } from '../edit-elevator-record-form/validation';

export type EditActionCellProps = {
  elevatorRecord: ElevatorRecord;
};

const EditActionCell = ({ elevatorRecord }: EditActionCellProps) => {
  const { isModalOpen, onCloseModal, onOpenModal } = useModal();

  const currentElevatorRecord = useMemo(() => convertElevatorRecordToFormValues(elevatorRecord), [elevatorRecord]);

  const { title } = useMemo(() => getElevatorRecordInfo(elevatorRecord), [elevatorRecord]);

  const { formState, onReset } = useFormState<ElevatorRecordFormValues>({
    initialValues: currentElevatorRecord,
    onCloseModal,
    resolver: zodResolver(elevatorRecordEditFormSchema),
  });

  const { isUpdateRecordLoading, onEditElevatorRecord } = useEditElevatorRecordForm({ onReset, elevatorRecord });

  const isEditButtonDisabled = elevatorRecord.status === 'Out of Service';

  const onHandleEditClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    onOpenModal();
  };

  return (
    <FormProvider {...formState}>
      <section className='flex justify-center items-center'>
        <Button
          className='hover:bg-transparent'
          disabled={isEditButtonDisabled}
          variant='ghost'
          onClick={onHandleEditClick}>
          <FaEdit className='h-5 w-5 text-primary' data-testid='edit-icon' />
        </Button>
        <EditModal
          isDisabled={!formState.formState.isDirty || isUpdateRecordLoading}
          isLoading={isUpdateRecordLoading}
          isOpen={isModalOpen}
          title={getModalTitle(title, true)}
          onClose={onCloseModal}
          onSubmit={formState.handleSubmit(onEditElevatorRecord)}>
          <EditElevatorRecordForm elevatorRecordFormValues={currentElevatorRecord} />
        </EditModal>
      </section>
    </FormProvider>
  );
};

export default EditActionCell;
