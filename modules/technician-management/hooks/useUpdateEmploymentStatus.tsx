import { useCallback } from 'react';

import { useModal } from '@/shared/hooks';

import { getEmploymentStatusUpdateConfig } from '../config';
import { EmploymentStatus, EmploymentStatusConfig } from '../types';

import { useUpdateTechnicianVisibility } from './useUpdateTechnicianVisibility';

export type UseUpdateEmploymentStatusProps = {
  employmentStatus: EmploymentStatus;
  technicianId: string;
  availabilityStatus: string | null;
  lastKnownAvailabilityStatus?: string | null;
  onRedirect?: () => void;
};

export type UseUpdateEmploymentStatus = {
  loading: boolean;
  config: EmploymentStatusConfig;
  isModalOpen: boolean;
  error?: string;
  onOpenModal: () => void;
  onHandleEmploymentStatusChange: () => void;
  onCloseModal: () => void;
};

export const useUpdateEmploymentStatus = ({
  employmentStatus,
  technicianId,
  availabilityStatus,
  lastKnownAvailabilityStatus,
  onRedirect,
}: UseUpdateEmploymentStatusProps): UseUpdateEmploymentStatus => {
  const { isModalOpen, onCloseModal, onOpenModal } = useModal();

  const { loading, onUpdateEmploymentStatus } = useUpdateTechnicianVisibility();

  const config = getEmploymentStatusUpdateConfig(lastKnownAvailabilityStatus ?? '')[employmentStatus] || {};

  const onHandleEmploymentStatusChange = useCallback(async () => {
    const result = await onUpdateEmploymentStatus({
      id: technicianId,
      newEmploymentStatus: config.newEmploymentStatus,
      newAvailabilityStatus: config.newAvailabilityStatus,
      currentAvailabilityStatus: availabilityStatus,
    });

    onCloseModal();

    if (!result?.errors?.length) onRedirect && onRedirect();
  }, [
    config.newEmploymentStatus,
    config.newAvailabilityStatus,
    onCloseModal,
    onUpdateEmploymentStatus,
    technicianId,
    availabilityStatus,
    onRedirect,
  ]);

  return {
    loading,
    config,
    isModalOpen,
    onOpenModal,
    onCloseModal,
    onHandleEmploymentStatusChange,
  };
};
