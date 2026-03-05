import { useCallback } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseFormReturn } from 'react-hook-form';

import { useFormState, useModal } from '@/shared/hooks';

import { TechnicianStatusFormValues } from '../components/employment-status-toggle-cell/types';
import { createTechnicianStatusChangeSchema } from '../components/employment-status-toggle-cell/validation';
import { getEmploymentStatusUpdateConfig } from '../config';
import { EmploymentStatus, EmploymentStatusConfig } from '../types';

import { useUpdateTechnicianVisibility } from './useUpdateTechnicianVisibility';

export type UseUpdateEmploymentStatusProps = {
  employmentStatus: EmploymentStatus;
  technicianId: string;
  availabilityStatus: string | null;
  lastKnownAvailabilityStatus?: string | null;
  iconColorClass?: string;
  onRedirect?: () => void;
};

export type UseUpdateEmploymentStatus = {
  loading: boolean;
  config: EmploymentStatusConfig;
  isModalOpen: boolean;
  error?: string;
  formState: UseFormReturn<TechnicianStatusFormValues>;
  onOpenModal: () => void;
  onHandleEmploymentStatusChange: ({ deactivationReason }: TechnicianStatusFormValues) => Promise<void>;
  onCloseModal: () => void;
};

export const useUpdateEmploymentStatus = ({
  employmentStatus,
  technicianId,
  availabilityStatus,
  lastKnownAvailabilityStatus,
  iconColorClass,
  onRedirect,
}: UseUpdateEmploymentStatusProps): UseUpdateEmploymentStatus => {
  const { isModalOpen, onCloseModal, onOpenModal } = useModal();

  const { loading, onUpdateEmploymentStatus } = useUpdateTechnicianVisibility();

  const { formState, onReset } = useFormState<TechnicianStatusFormValues>({
    initialValues: { deactivationReason: '' },
    resolver: zodResolver(createTechnicianStatusChangeSchema(employmentStatus !== 'Inactive')),
    onCloseModal,
  });

  const config =
    getEmploymentStatusUpdateConfig(lastKnownAvailabilityStatus ?? '', iconColorClass)[employmentStatus] || {};

  const onHandleEmploymentStatusChange = useCallback(
    async ({ deactivationReason }: TechnicianStatusFormValues) => {
      const result = await onUpdateEmploymentStatus({
        id: technicianId,
        newEmploymentStatus: config.newEmploymentStatus,
        newAvailabilityStatus: config.newAvailabilityStatus,
        currentAvailabilityStatus: availabilityStatus,
        deactivationReason,
      });

      onReset();

      if (!result?.errors?.length) onRedirect && onRedirect();
    },
    [
      config.newEmploymentStatus,
      config.newAvailabilityStatus,
      onReset,
      onUpdateEmploymentStatus,
      technicianId,
      availabilityStatus,
      onRedirect,
    ]
  );

  const onHandleCloseModal = useCallback(() => {
    onReset();
    onCloseModal();
  }, [onReset, onCloseModal]);

  return {
    loading,
    config,
    isModalOpen,
    formState,
    onOpenModal,
    onCloseModal: onHandleCloseModal,
    onHandleEmploymentStatusChange,
  };
};
