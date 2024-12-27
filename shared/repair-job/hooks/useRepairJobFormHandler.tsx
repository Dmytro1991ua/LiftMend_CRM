import { SubmitHandler } from 'react-hook-form';

import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import useUpdateRepairJob from '@/shared/repair-job/hooks/useUpdateRepairJob';
import { RepairJob } from '@/shared/types';

import { RepairJobFormValues } from '../edit-repair-job-form/types';

type UseEditRepairJobProps = {
  repairJob: RepairJob;
  onReset: () => void;
};

type UseEditRepairJob = {
  isEditRepairJobLoading: boolean;
  onEditRepairJob: SubmitHandler<RepairJobFormValues>;
};

const useRepairJobFormHandler = ({ repairJob, onReset }: UseEditRepairJobProps): UseEditRepairJob => {
  const { onError, onSuccess } = useMutationResultToasts();

  const { onUpdateRepairJob, isLoading } = useUpdateRepairJob({ onError, onSuccess });

  const onEditRepairJob: SubmitHandler<RepairJobFormValues> = async (data) => {
    const updatedRepairJob = {
      ...data,
      id: repairJob.id,
      technicianName: repairJob.technicianName,
      calendarEventId: repairJob.calendarEventId,
    };

    await onUpdateRepairJob(updatedRepairJob, repairJob);

    onReset();
  };

  return {
    isEditRepairJobLoading: isLoading,
    onEditRepairJob,
  };
};

export default useRepairJobFormHandler;
