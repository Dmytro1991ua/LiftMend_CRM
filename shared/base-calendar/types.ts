import { DateSelectArg } from '@fullcalendar/core';

export type CalendarActions = {
  isDeleteEventModalOpen?: boolean;
  isLoading?: boolean;
  onOpenDeleteEventModal: () => void;
  onDeleteCalendarEvent: (calendarEventId?: string, repairJobId?: string) => Promise<void>;
  onCloseDeleteEventModal: () => void;
  onHandleDateClick?: (selectedDate: DateSelectArg) => void;
};
