import { SubmitHandler } from 'react-hook-form';

import useUpdateTechnicianRecord from '@/modules/technician-management/hooks/useUpdateTechnicianRecord';
import { TechnicianRecordFormValues } from '@/modules/technician-management/types';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import { TechnicianRecord } from '@/shared/types';

type UseEditTechnicianRecordFormProps = {
  technicianRecord: TechnicianRecord;
  onReset: () => void;
};

type UseEditTechnicianRecordForm = {
  isUpdateRecordLoading: boolean;
  onEditTechnicianRecord: SubmitHandler<TechnicianRecordFormValues>;
};

const useEditTechnicianRecordForm = ({
  technicianRecord,
  onReset,
}: UseEditTechnicianRecordFormProps): UseEditTechnicianRecordForm => {
  const { onError, onSuccess } = useMutationResultToasts();

  const { onUpdateTechnicianRecord, isLoading: isUpdateRecordLoading } = useUpdateTechnicianRecord({
    onError,
    onSuccess,
  });

  const onEditTechnicianRecord: SubmitHandler<TechnicianRecordFormValues> = async (data) => {
    const updateTechnicianRecord = {
      ...data,
      id: technicianRecord?.id ?? '',
    };

    await onUpdateTechnicianRecord(updateTechnicianRecord, technicianRecord);

    onReset();
  };

  return {
    onEditTechnicianRecord,
    isUpdateRecordLoading,
  };
};

export default useEditTechnicianRecordForm;
