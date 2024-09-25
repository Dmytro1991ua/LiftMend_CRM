import { FaTrashAlt } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import DeleteModal from '@/shared/base-modal/delete-modal';
import { useModal } from '@/shared/hooks';
import { DEFAULT_DELETE_MODAL_TITLE } from '@/shared/repair-job/constants';
import useRepairJobDeletion from '@/shared/repair-job/hooks/useRepairJobDeletion';
import { getDeleteModalDescription } from '@/shared/repair-job/utils';
import { getCalendarEventInfo } from '@/shared/utils';

import { RepairJob } from '../repair-job-table/columns';

type DeleteActionCelProps = {
  repairJob: RepairJob;
};

const DeleteActionCell = ({ repairJob }: DeleteActionCelProps) => {
  const { isModalOpen, onCloseModal, onOpenModal } = useModal();

  const { isDeleteRepairJobLoading, onDeleteRepairJob } = useRepairJobDeletion({
    onCloseModal,
    calendarEventId: repairJob.calendarEventId ?? '',
    repairJobId: repairJob.id,
  });

  const { title } = getCalendarEventInfo({
    elevatorType: repairJob.elevatorType,
    elevatorLocation: repairJob.elevatorLocation,
    buildingName: repairJob.buildingName,
    jobType: repairJob.jobType,
  });

  const onHandleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    onOpenModal();
  };

  return (
    <section className='flex justify-center items-center'>
      <Button className='hover:bg-transparent' variant='ghost' onClick={onHandleDeleteClick}>
        <FaTrashAlt className='h-4 w-4 text-red-500' />
      </Button>
      <DeleteModal
        description={getDeleteModalDescription(title)}
        isDisabled={isDeleteRepairJobLoading}
        isLoading={isDeleteRepairJobLoading}
        isOpen={isModalOpen}
        title={DEFAULT_DELETE_MODAL_TITLE}
        onClose={onCloseModal}
        onSubmit={onDeleteRepairJob}
      />
    </section>
  );
};

export default DeleteActionCell;
