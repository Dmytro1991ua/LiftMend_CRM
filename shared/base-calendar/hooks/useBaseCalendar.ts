import { useCallback, useState } from 'react';

import { DateSelectArg } from '@fullcalendar/core';
import { startOfToday } from 'date-fns';

import { useBaseToast } from '@/shared/hooks';
import { BaseToastVariant } from '@/shared/hooks/useBaseToast/types';

type useBaseCalendar = {
  isCreateEventModalOpen: boolean;
  isDeleteEventModalOpen: boolean;
  onOpenCreateEventModalOpen: () => void;
  onCloseCreateEventModalOpen: () => void;
  onOpenDeleteEventModalOpen: () => void;
  onCloseDeleteEventModalOpen: () => void;
  onHandleDateClick: (selectedDate: DateSelectArg) => void;
};

export const useBaseCalendar = () => {
  const { baseToast } = useBaseToast(BaseToastVariant.Warning);

  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState<boolean>(false);
  const [isDeleteEventModalOpen, setIsDeleteEventModalOpen] = useState<boolean>(false);

  const onOpenCreateEventModalOpen = useCallback(() => setIsCreateEventModalOpen(true), []);

  const onCloseCreateEventModalOpen = useCallback(() => setIsCreateEventModalOpen(false), []);
  const onOpenDeleteEventModalOpen = useCallback(() => setIsDeleteEventModalOpen(true), []);
  const onCloseDeleteEventModalOpen = useCallback(() => setIsDeleteEventModalOpen(false), []);

  const onHandleDateClick = useCallback(
    (selectedDate: DateSelectArg) => {
      const today = startOfToday();

      if (selectedDate.start < today) {
        baseToast('You cannot schedule repair job in a past date.');
      } else {
        onOpenCreateEventModalOpen();
      }
    },
    [onOpenCreateEventModalOpen, baseToast]
  );

  return {
    isCreateEventModalOpen,
    isDeleteEventModalOpen,
    onOpenCreateEventModalOpen,
    onCloseCreateEventModalOpen,
    onOpenDeleteEventModalOpen,
    onCloseDeleteEventModalOpen,
    onHandleDateClick,
  };
};
