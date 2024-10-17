import { useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider } from 'react-hook-form';
import { FaEdit } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import EditModal from '@/shared/base-modal/edit-modal';
import { getModalTitle } from '@/shared/base-modal/edit-modal/utils';
import { useModal } from '@/shared/hooks';
import useFormState from '@/shared/hooks/useFormState';
import { ElevatorRecord } from '@/shared/types';

import { ElevatorRecordFormValues } from '../../types';
import { convertElevatorRecordToFormValues } from '../../utils';
import EditElevatorRecordForm from '../edit-elevator-record-form';
import { elevatorRecordEditFormSchema } from '../edit-elevator-record-form/validation';
import useElevatorRecordForm from '../elevator-record-form/hooks';

type EditActionCellProps = {
  elevatorRecord: ElevatorRecord;
};

const EditActionCell = ({ elevatorRecord }: EditActionCellProps) => {
  const { isModalOpen, onCloseModal, onOpenModal } = useModal();

  const currentElevatorRecord = useMemo(() => convertElevatorRecordToFormValues(elevatorRecord), [elevatorRecord]);

  const { formState, onReset } = useFormState<ElevatorRecordFormValues>({
    initialValues: currentElevatorRecord,
    onCloseModal,
    resolver: zodResolver(elevatorRecordEditFormSchema),
  });

  const { isUpdateRecordLoading, onEditElevatorRecord } = useElevatorRecordForm({ onReset, elevatorRecord });

  const onHandleEditClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    onOpenModal();
  };

  return (
    <FormProvider {...formState}>
      <section className='flex justify-center items-center'>
        <Button className='hover:bg-transparent' variant='ghost' onClick={onHandleEditClick}>
          <FaEdit className='h-5 w-5 text-primary' />
        </Button>
        <EditModal
          isDisabled={!formState.formState.isDirty || isUpdateRecordLoading}
          isOpen={isModalOpen}
          title={getModalTitle(elevatorRecord.elevatorType, true, 'elevator record')}
          onClose={onCloseModal}
          onSubmit={formState.handleSubmit(onEditElevatorRecord)}
        >
          <EditElevatorRecordForm elevatorRecord={elevatorRecord} />
        </EditModal>
      </section>
    </FormProvider>
  );
};

export default EditActionCell;
