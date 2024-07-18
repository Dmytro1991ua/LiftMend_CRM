import { DateSelectArg } from '@fullcalendar/core';

export type CalendarActions = {
  isDeleteEventModalOpen?: boolean;
  onOpenDeleteEventModalOpen: () => void;
  onCloseDeleteEventModalOpen: () => void;
  onHandleDateClick?: (selectedDate: DateSelectArg) => void;
};
