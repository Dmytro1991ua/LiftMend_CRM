import { useCallback } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseFormReturn, useForm } from 'react-hook-form';

import {
  INITIAL_VALUES,
  RepairJobFromFields,
  repairJobFormSchema,
} from '../components/repair-job-tracking-from/validation';

type UseRepairJobTrackingFormStateProps = {
  onCloseCreateEventModalOpen: () => void;
};

type UseRepairJobTrackingFormState = {
  onReset: () => void;
  formState: UseFormReturn<RepairJobFromFields>;
};

const useRepairJobTrackingFormState = ({
  onCloseCreateEventModalOpen,
}: UseRepairJobTrackingFormStateProps): UseRepairJobTrackingFormState => {
  const formState = useForm<RepairJobFromFields>({
    shouldUnregister: false,
    mode: 'onSubmit',
    defaultValues: INITIAL_VALUES,
    resolver: zodResolver(repairJobFormSchema),
  });

  const { reset, clearErrors } = formState;

  const onReset = useCallback((): void => {
    reset(INITIAL_VALUES);
    clearErrors();
    onCloseCreateEventModalOpen();
  }, [reset, clearErrors, onCloseCreateEventModalOpen]);

  return {
    formState,
    onReset,
  };
};

export default useRepairJobTrackingFormState;
