import { useCallback } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseFormReturn, useForm } from 'react-hook-form';

import {
  INITIAL_REPAIR_JOB_VALUES,
  RepairJobFromFields,
  repairJobFormSchema,
} from '../components/repair-job-tracking-from/validation';

type UseRepairJobTrackingFormStateProps = {
  onCloseCreateEventModal: () => void;
};

type UseRepairJobTrackingFormState = {
  onReset: () => void;
  formState: UseFormReturn<RepairJobFromFields>;
};

const useRepairJobTrackingFormState = ({
  onCloseCreateEventModal,
}: UseRepairJobTrackingFormStateProps): UseRepairJobTrackingFormState => {
  const formState = useForm<RepairJobFromFields>({
    shouldUnregister: false,
    mode: 'onSubmit',
    defaultValues: INITIAL_REPAIR_JOB_VALUES,
    resolver: zodResolver(repairJobFormSchema),
  });

  const { reset, clearErrors } = formState;

  const onReset = useCallback((): void => {
    reset(INITIAL_REPAIR_JOB_VALUES);
    clearErrors();
    onCloseCreateEventModal();
  }, [reset, clearErrors, onCloseCreateEventModal]);

  return {
    formState,
    onReset,
  };
};

export default useRepairJobTrackingFormState;
