import { useDeleteElevatorRecord } from '@/modules/elevator-management/hooks';

type UseElevatorRecordDeletionProps = {
  id: string;
  onCloseModal: () => void;
  onRedirect?: () => void;
};

export type UseElevatorRecordDeletion = {
  isDeleteElevatorRecordLoading: boolean;
  onHandleDeleteElevatorRecord: () => Promise<void>;
};

export const useElevatorRecordDeletion = ({
  id,
  onCloseModal,
  onRedirect,
}: UseElevatorRecordDeletionProps): UseElevatorRecordDeletion => {
  const { onDeleteElevatorRecord, isLoading } = useDeleteElevatorRecord();

  const onHandleDeleteElevatorRecord = async () => {
    await onDeleteElevatorRecord(id);

    onCloseModal();

    onRedirect && onRedirect();
  };

  return {
    onHandleDeleteElevatorRecord,
    isDeleteElevatorRecordLoading: isLoading,
  };
};
