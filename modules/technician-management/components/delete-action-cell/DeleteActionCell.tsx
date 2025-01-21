import { FaTrashAlt } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import DeleteModal from '@/shared/base-modal/delete-modal';
import { getModalDescription } from '@/shared/base-modal/edit-modal/utils';
import { useModal } from '@/shared/hooks';
import { TechnicianRecord } from '@/shared/types';

import { DEFAULT_DELETE_TECHNICIAN_MODAL_TITLE } from '../../constants';

import useTechnicianRecordDeletion from './hooks/useTechnicianRecordDeletion';

type DeleteActionCelProps = {
  technicianRecord: TechnicianRecord;
};

const DeleteActionCell = ({ technicianRecord }: DeleteActionCelProps) => {
  const { isModalOpen, onCloseModal, onOpenModal } = useModal();

  const { isDeleteTechnicianRecordLoading, onHandleDeleteTechnicianRecord } = useTechnicianRecordDeletion({
    onCloseModal,
    id: technicianRecord.id,
  });

  const isDeleteButtonDisabled = technicianRecord.employmentStatus !== 'Active';

  const onHandleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    onOpenModal();
  };

  return (
    <section className='flex justify-center items-center'>
      <Button
        className='hover:bg-transparent'
        disabled={isDeleteButtonDisabled}
        variant='ghost'
        onClick={onHandleDeleteClick}>
        <FaTrashAlt className='h-4 w-4 text-red-500' />
      </Button>
      <DeleteModal
        description={getModalDescription(technicianRecord.name, 'record')}
        isDisabled={isDeleteTechnicianRecordLoading}
        isLoading={isDeleteTechnicianRecordLoading}
        isOpen={isModalOpen}
        title={DEFAULT_DELETE_TECHNICIAN_MODAL_TITLE}
        onClose={onCloseModal}
        onSubmit={onHandleDeleteTechnicianRecord}
      />
    </section>
  );
};

export default DeleteActionCell;
