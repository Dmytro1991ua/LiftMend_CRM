import { SubmitHandler } from 'react-hook-form';

import { useUpdateTechnicianRecord } from '@/modules/technician-management/hooks';
import { TechnicianRecordFormValues } from '@/modules/technician-management/types';
import { TechnicianRecord } from '@/shared/types';

type UseEditTechnicianRecordFormProps = {
  technicianRecord: TechnicianRecord;
  onReset: () => void;
};

export type UseEditTechnicianRecordForm = {
  isUpdateRecordLoading: boolean;
  onEditTechnicianRecord: SubmitHandler<TechnicianRecordFormValues>;
};

export const useEditTechnicianRecordForm = ({
  technicianRecord,
  onReset,
}: UseEditTechnicianRecordFormProps): UseEditTechnicianRecordForm => {
  const { onUpdateTechnicianRecord, isLoading: isUpdateRecordLoading } = useUpdateTechnicianRecord();

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
