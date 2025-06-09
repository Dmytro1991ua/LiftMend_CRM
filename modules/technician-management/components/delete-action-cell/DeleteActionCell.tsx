import { FaTrashAlt } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import DeleteModal from '@/shared/base-modal/delete-modal';
import { getModalDescription } from '@/shared/base-modal/edit-modal/utils';
import BaseTooltip from '@/shared/base-tooltip';
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
      {/* TODO => Temporary disable => make enable if permissions will be implemented*/}
      <BaseTooltip
        shouldRenderInPortal
        className='w-[33rem] !shadow-none'
        id='delete-button-tooltip'
        message={'You do not have permission to proceed with this action'}>
        <Button
          className='hover:bg-transparent'
          disabled={true} /* TODO => Temporary disable => make enable if permissions will be implemented*/
          variant='ghost'
          onClick={onHandleDeleteClick}>
          <FaTrashAlt className='h-4 w-4 text-red-500' data-testid='trash-icon' />
        </Button>
      </BaseTooltip>
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
