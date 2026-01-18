import { SubmitHandler } from 'react-hook-form';

import { useUpdateElevatorRecord } from '@/modules/elevator-management/hooks';
import { ElevatorRecordFormValues } from '@/modules/elevator-management/types';
import { ElevatorRecord } from '@/shared/types';

type UseEditElevatorRecordFormProps = {
  elevatorRecord: Omit<ElevatorRecord, 'inspectionStatus'>;
  onReset: () => void;
};

export type UseEditElevatorRecordForm = {
  isUpdateRecordLoading: boolean;
  onEditElevatorRecord: SubmitHandler<ElevatorRecordFormValues>;
};

const useEditElevatorRecordForm = ({
  elevatorRecord,
  onReset,
}: UseEditElevatorRecordFormProps): UseEditElevatorRecordForm => {
  const { onUpdateElevatorRecord, isLoading: isUpdateRecordLoading } = useUpdateElevatorRecord();

  const onEditElevatorRecord: SubmitHandler<ElevatorRecordFormValues> = async (data): Promise<void> => {
    const updateElevatorRecord = {
      ...data,
      id: elevatorRecord?.id ?? '',
    };

    await onUpdateElevatorRecord(updateElevatorRecord, elevatorRecord);
    onReset();
  };

  return {
    onEditElevatorRecord,
    isUpdateRecordLoading,
  };
};

export default useEditElevatorRecordForm;
