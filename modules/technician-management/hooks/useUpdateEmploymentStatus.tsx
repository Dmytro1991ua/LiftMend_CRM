import { useCallback } from 'react';

import { useModal } from '@/shared/hooks';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';

import { getEmploymentStatusUpdateConfig } from '../config';
import { EmploymentStatus, EmploymentStatusConfig } from '../types';

import useUpdateTechnicianVisibility from './useUpdateTechnicianVisibility';

type UseUpdateEmploymentStatusProps = {
  employmentStatus: EmploymentStatus;
  technicianId: string;
  availabilityStatus: string | null;
  lastKnownAvailabilityStatus?: string | null;
  onRedirect?: () => void;
};

type UseUpdateEmploymentStatus = {
  loading: boolean;
  config: EmploymentStatusConfig;
  isModalOpen: boolean;
  error?: string;
  onOpenModal: () => void;
  onHandleEmploymentStatusChange: () => void;
  onCloseModal: () => void;
};

const useUpdateEmploymentStatus = ({
  employmentStatus,
  technicianId,
  availabilityStatus,
  lastKnownAvailabilityStatus,
  onRedirect,
}: UseUpdateEmploymentStatusProps): UseUpdateEmploymentStatus => {
  const { isModalOpen, onCloseModal, onOpenModal } = useModal();
  const { onError, onSuccess } = useMutationResultToasts();

  const { loading, onUpdateEmploymentStatus } = useUpdateTechnicianVisibility({
    onError,
    onSuccess,
  });

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

export default useUpdateEmploymentStatus;
