import { SubmitHandler } from 'react-hook-form';

import { RepairJob } from '@/shared/types';

import { ReassignTechnicianFormValues } from '../edit-repair-job-form/types';

import { useReassignTechnician } from './useReassignTechnician';

type UseReassignTechnicianFormHandlerProps = {
  repairJob: RepairJob;
  onReset: () => void;
};

export type UseUseReassignTechnicianFormHandler = {
  isReassignTechnicianLoading: boolean;
  onHandleTechnicianReassignment: SubmitHandler<ReassignTechnicianFormValues>;
};

export const useReassignTechnicianFormHandler = ({
  repairJob,
  onReset,
}: UseReassignTechnicianFormHandlerProps): UseUseReassignTechnicianFormHandler => {
  const { onReassignTechnician, isLoading } = useReassignTechnician();

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
