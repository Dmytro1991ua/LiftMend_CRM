import { useCallback, useEffect, useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseFormReturn, useForm } from 'react-hook-form';

import { RepairJob } from '@/graphql/types/client/generated_types';

import { repairJobDetailsFormSchema } from '../components/edit-repair-job-form/validation';
import { RepairJobDetailsFormValues } from '../types';
import { convertRepairJobToFormValues } from '../utils';

type UseRepairJobDetailsFormStateProps = {
  onCloseModal: () => void;
  repairJob: RepairJob;
};

type UseRepairJobDetailsFormState = {
  onReset: () => void;
  repairJobFormState: UseFormReturn<RepairJobDetailsFormValues>;
};

const useRepairJobDetailsFormState = ({
  repairJob,
  onCloseModal,
}: UseRepairJobDetailsFormStateProps): UseRepairJobDetailsFormState => {
  const currentRepairJob = useMemo(() => convertRepairJobToFormValues(repairJob), [repairJob]);

  const formState = useForm<RepairJobDetailsFormValues>({
    shouldUnregister: false,
    mode: 'onChange',
    defaultValues: currentRepairJob,
    resolver: zodResolver(repairJobDetailsFormSchema),
  });

  const { reset, clearErrors } = formState;

  useEffect(() => {
    reset(currentRepairJob, { keepDirty: false });
  }, [currentRepairJob, reset]);

  const onReset = useCallback((): void => {
    reset(currentRepairJob, { keepDirty: false });
    clearErrors();
    onCloseModal();
  }, [reset, onCloseModal, currentRepairJob, clearErrors]);

  return {
    repairJobFormState: formState,
    onReset,
  };
};

export default useRepairJobDetailsFormState;
