import { SubmitHandler } from 'react-hook-form';

import { RepairJob } from '@/shared/types';

import { RepairJobFormValues } from '../edit-repair-job-form/types';

import { useUpdateRepairJob } from './useUpdateRepairJob';

type UseRepairJobFormHandlerProps = {
  repairJob: RepairJob;
  onReset: () => void;
};

export type UseRepairJobFormHandler = {
  isEditRepairJobLoading: boolean;
  onEditRepairJob: SubmitHandler<RepairJobFormValues>;
};

export const useRepairJobFormHandler = ({
  repairJob,
  onReset,
}: UseRepairJobFormHandlerProps): UseRepairJobFormHandler => {
  const { onUpdateRepairJob, isLoading } = useUpdateRepairJob();

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
