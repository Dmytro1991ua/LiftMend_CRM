import { DateSelectArg } from '@fullcalendar/core';

export type CalendarActions = {
  isDeleteEventModalOpen?: boolean;
  isLoading?: boolean;
  onOpenDeleteEventModalOpen: () => void;
  onDeleteCalendarEvent: (calendarEventId?: string, repairJobId?: string) => Promise<void>;
  onCloseDeleteEventModalOpen: () => void;
  onHandleDateClick?: (selectedDate: DateSelectArg) => void;
};
