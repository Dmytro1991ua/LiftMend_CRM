import useDeleteElevatorRecord from '@/modules/elevator-management/hooks/useDeleteElevatorRecord';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';

type UseElevatorRecordDeletionProps = {
  id: string;
  onCloseModal: () => void;
  onRedirect?: () => void;
};

type UseElevatorRecordDeletion = {
  isDeleteElevatorRecordLoading: boolean;
  onHandleDeleteElevatorRecord: () => Promise<void>;
};

const useElevatorRecordDeletion = ({
  id,
  onCloseModal,
  onRedirect,
}: UseElevatorRecordDeletionProps): UseElevatorRecordDeletion => {
  const { onError, onSuccess } = useMutationResultToasts();

  const { onDeleteElevatorRecord, isLoading } = useDeleteElevatorRecord({
    onError,
    onSuccess,
  });

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

export default useElevatorRecordDeletion;
