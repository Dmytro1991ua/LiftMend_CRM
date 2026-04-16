import { useCallback } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseFormReturn } from 'react-hook-form';

import { useFormState, useModal } from '@/shared/hooks';
import { useUpdateRepairJob, useUploadRepairJobEvidencePhoto } from '@/shared/repair-job/hooks';
import { RepairJob } from '@/shared/types';

import { CompleteRepairJobFormValues } from '../types';
import { completeRepairJobSchema } from '../validation';

export type UseCompleteRepairJob = {
  formState: UseFormReturn<CompleteRepairJobFormValues>;
  isModalOpen: boolean;
  onOpenModal: () => void;
  onHandleCloseModal: () => void;
  onHandleComplete: (values: CompleteRepairJobFormValues) => Promise<void>;
  isLoading: boolean;
};

export const useCompleteRepairJob = (repairJob: RepairJob) => {
  const { formState, onReset } = useFormState<CompleteRepairJobFormValues>({
    initialValues: { checklist: repairJob?.checklist ?? [], evidencePhoto: null },
    resolver: zodResolver(completeRepairJobSchema),
  });

  const { onCompleteRepairJob, isLoading } = useUpdateRepairJob();
  const { onFileUpload } = useUploadRepairJobEvidencePhoto();

  const { isModalOpen, onOpenModal, onCloseModal } = useModal();

  const onHandleCloseModal = useCallback(() => {
    onCloseModal();
    onReset();
  }, [onCloseModal, onReset]);

  const onHandleComplete = useCallback(
    async (values: CompleteRepairJobFormValues) => {
      const result = await onCompleteRepairJob({
        ...repairJob,
        checklist: values.checklist,
      });

      const repairJobId = result?.data?.updateRepairJob?.id;

      if (!repairJobId) return;

      const file = values.evidencePhoto;

      if (file) {
        await onFileUpload([file], (file) => ({
          repairJobId,
          file,
          photoEvidencePhase: 'AFTER',
        }));
      }

      if (!result?.errors?.length) onHandleCloseModal();
    },
    [repairJob, onCompleteRepairJob, onHandleCloseModal, onFileUpload]
  );

  return {
    formState,
    isModalOpen,
    onHandleCloseModal,
    onHandleComplete,
    onOpenModal,
    isLoading,
  };
};
