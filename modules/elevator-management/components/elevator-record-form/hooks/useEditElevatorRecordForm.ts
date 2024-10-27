import { SubmitHandler } from 'react-hook-form';

import useUpdateElevatorRecord from '@/modules/elevator-management/hooks/useUpdateElevatorRecord';
import { ElevatorRecordFormValues } from '@/modules/elevator-management/types';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import { ElevatorRecord } from '@/shared/types';

type UseEditElevatorRecordFormProps = {
  elevatorRecord: ElevatorRecord;
  onReset: () => void;
};

type UseEditElevatorRecordForm = {
  isUpdateRecordLoading: boolean;
  onEditElevatorRecord: SubmitHandler<ElevatorRecordFormValues>;
};

const useEditElevatorRecordForm = ({
  elevatorRecord,
  onReset,
}: UseEditElevatorRecordFormProps): UseEditElevatorRecordForm => {
  const { onError, onSuccess } = useMutationResultToasts();

  const { onUpdateElevatorRecord, isLoading: isUpdateRecordLoading } = useUpdateElevatorRecord({ onError, onSuccess });

  const onEditElevatorRecord: SubmitHandler<ElevatorRecordFormValues> = async (data) => {
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
