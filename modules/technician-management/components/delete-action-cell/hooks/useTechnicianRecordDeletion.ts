import useDeleteTechnicianRecord from '@/modules/technician-management/hooks/useDeleteTechnicianRecord';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';

type UseTechnicianRecordDeletionProps = {
  id: string;
  onCloseModal: () => void;
  onRedirect?: () => void;
};

type UseTechnicianRecordDeletion = {
  isDeleteTechnicianRecordLoading: boolean;
  onHandleDeleteTechnicianRecord: () => Promise<void>;
};

const useTechnicianRecordDeletion = ({
  id,
  onCloseModal,
  onRedirect,
}: UseTechnicianRecordDeletionProps): UseTechnicianRecordDeletion => {
  const { onError, onSuccess } = useMutationResultToasts();

  const { onDeleteTechnicianRecord, isLoading } = useDeleteTechnicianRecord({
    onError,
    onSuccess,
  });

  const onHandleDeleteTechnicianRecord = async () => {
    await onDeleteTechnicianRecord(id);

    onCloseModal();

    onRedirect && onRedirect();
  };

  return {
    onHandleDeleteTechnicianRecord,
    isDeleteTechnicianRecordLoading: isLoading,
  };
};

export default useTechnicianRecordDeletion;
