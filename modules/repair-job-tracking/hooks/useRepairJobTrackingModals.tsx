import { useCallback, useState } from 'react';

import { DateSelectArg } from '@fullcalendar/core';
import { startOfToday } from 'date-fns';

import useBaseStepper from '@/shared/base-stepper/hooks';
import { useBaseToast } from '@/shared/hooks';
import { BaseToastVariant } from '@/shared/hooks/useBaseToast/types';

type useRepairJobTrackingModals = {
  selectedDateRange: DateSelectArg | null;
  isCreateEventModalOpen: boolean;
  isDeleteEventModalOpen: boolean;
  onOpenCreateEventModalOpen: () => void;
  onCloseCreateEventModalOpen: () => void;
  onOpenDeleteEventModalOpen: () => void;
  onCloseDeleteEventModalOpen: () => void;
  onHandleDateClick: (selectedDate: DateSelectArg) => void;
};

const useRepairJobTrackingModals = () => {
  const { baseToast } = useBaseToast(BaseToastVariant.Warning);
  const { onCancel } = useBaseStepper({});

  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState<boolean>(false);
  const [isDeleteEventModalOpen, setIsDeleteEventModalOpen] = useState<boolean>(false);
  const [selectedDateRange, setSelectedDateRange] = useState<DateSelectArg | null>(null);

  const onOpenCreateEventModalOpen = useCallback(() => setIsCreateEventModalOpen(true), []);

  const onCloseCreateEventModalOpen = useCallback(() => {
    setIsCreateEventModalOpen(false);
    onCancel();
  }, [onCancel]);
  const onOpenDeleteEventModalOpen = useCallback(() => setIsDeleteEventModalOpen(true), []);
  const onCloseDeleteEventModalOpen = useCallback(() => setIsDeleteEventModalOpen(false), []);

  const onHandleDateClick = useCallback(
    (selectedDate: DateSelectArg) => {
      const today = startOfToday();

      if (selectedDate.start < today) {
        baseToast('You cannot schedule repair job in a past date.');
      } else {
        setSelectedDateRange(selectedDate);
        onOpenCreateEventModalOpen();
      }
    },
    [baseToast, onOpenCreateEventModalOpen]
  );

  return {
    selectedDateRange,
    isCreateEventModalOpen,
    isDeleteEventModalOpen,
    onOpenCreateEventModalOpen,
    onCloseCreateEventModalOpen,
    onOpenDeleteEventModalOpen,
    onCloseDeleteEventModalOpen,
    onHandleDateClick,
  };
};

export default useRepairJobTrackingModals;
