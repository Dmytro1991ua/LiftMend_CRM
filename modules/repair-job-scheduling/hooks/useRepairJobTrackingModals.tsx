import { useCallback, useState } from 'react';

import { DateSelectArg } from '@fullcalendar/core';
import { startOfToday } from 'date-fns';

import useBaseStepper from '@/shared/base-stepper/hooks';
import { useBaseToast } from '@/shared/hooks';
import { BaseToastVariant } from '@/shared/hooks/useBaseToast/types';

type UseRepairJobTrackingModals = {
  selectedDateRange: DateSelectArg | null;
  isCreateEventModalOpen: boolean;
  isDeleteEventModalOpen: boolean;
  onOpenCreateEventModal: () => void;
  onCloseCreateEventModal: () => void;
  onOpenDeleteEventModal: () => void;
  onCloseDeleteEventModal: () => void;
  onHandleDateClick: (selectedDate: DateSelectArg) => void;
};

export const useRepairJobTrackingModals = (): UseRepairJobTrackingModals => {
  const { baseToast } = useBaseToast(BaseToastVariant.Warning);
  const { onCancel } = useBaseStepper({});

  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState<boolean>(false);
  const [isDeleteEventModalOpen, setIsDeleteEventModalOpen] = useState<boolean>(false);
  const [selectedDateRange, setSelectedDateRange] = useState<DateSelectArg | null>(null);

  const onOpenCreateEventModal = useCallback(() => setIsCreateEventModalOpen(true), []);

  const onCloseCreateEventModal = useCallback(() => {
    setIsCreateEventModalOpen(false);
    onCancel();
  }, [onCancel]);
  const onOpenDeleteEventModal = useCallback(() => setIsDeleteEventModalOpen(true), []);
  const onCloseDeleteEventModal = useCallback(() => setIsDeleteEventModalOpen(false), []);

  const onHandleDateClick = useCallback(
    (selectedDate: DateSelectArg) => {
      const today = startOfToday();

      if (selectedDate.start < today) {
        baseToast('Schedule Repair Job Warning', 'You cannot schedule repair job in a past date.');
      } else {
        setSelectedDateRange(selectedDate);
        onOpenCreateEventModal();
      }
    },
    [baseToast, onOpenCreateEventModal]
  );

  return {
    selectedDateRange,
    isCreateEventModalOpen,
    isDeleteEventModalOpen,
    onOpenCreateEventModal,
    onCloseCreateEventModal,
    onOpenDeleteEventModal,
    onCloseDeleteEventModal,
    onHandleDateClick,
  };
};
