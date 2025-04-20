import { useDeleteElevatorRecord } from '@/modules/elevator-management/hooks';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';

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
