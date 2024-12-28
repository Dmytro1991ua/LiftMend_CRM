import { SubmitHandler } from 'react-hook-form';

import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import { RepairJob } from '@/shared/types';

import { ReassignTechnicianFormValues } from '../edit-repair-job-form/types';

import useReassignTechnician from './useReassignTechnician';

type UseReassignTechnicianFormHandlerProps = {
  repairJob: RepairJob;
  onReset: () => void;
};

type UseUseReassignTechnicianFormHandler = {
  isReassignTechnicianLoading: boolean;
  onHandleTechnicianReassignment: SubmitHandler<ReassignTechnicianFormValues>;
};

const useReassignTechnicianFormHandler = ({
  repairJob,
  onReset,
}: UseReassignTechnicianFormHandlerProps): UseUseReassignTechnicianFormHandler => {
  const { onError, onSuccess } = useMutationResultToasts();

  const { onReassignTechnician, isLoading } = useReassignTechnician({ onError, onSuccess });

  const onHandleTechnicianReassignment: SubmitHandler<ReassignTechnicianFormValues> = async (data) => {
    const updatedRepairJob = {
      ...repairJob,
      id: repairJob.id,
      technicianName: data.technicianName,
    };

    await onReassignTechnician(updatedRepairJob, repairJob);

    onReset();
  };

  return {
    isReassignTechnicianLoading: isLoading,
    onHandleTechnicianReassignment,
  };
};

export default useReassignTechnicianFormHandler;
