import { useDeleteTechnicianRecord } from '@/modules/technician-management/hooks';

type UseTechnicianRecordDeletionProps = {
  id: string;
  onCloseModal: () => void;
  onRedirect?: () => void;
};

export type UseTechnicianRecordDeletion = {
  isDeleteTechnicianRecordLoading: boolean;
  onHandleDeleteTechnicianRecord: () => Promise<void>;
};

const useTechnicianRecordDeletion = ({
  id,
  onCloseModal,
  onRedirect,
}: UseTechnicianRecordDeletionProps): UseTechnicianRecordDeletion => {
  const { onDeleteTechnicianRecord, isLoading } = useDeleteTechnicianRecord();

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
