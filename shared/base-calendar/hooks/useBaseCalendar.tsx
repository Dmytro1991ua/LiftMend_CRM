import { useCallback, useState } from 'react';

import { EventContentArg } from '@fullcalendar/core';

import { CalendarActions } from '../types';

export type UseBaseCalendarProps = {
  calendarActions?: CalendarActions;
};

type UseBaseCalendarReturn = {
  onSetCalendarEvent: (eventInfo: EventContentArg) => void;
  onDeleteCalendarEventAndRepairJob: () => void;
};

export const useBaseCalendar = ({ calendarActions }: UseBaseCalendarProps): UseBaseCalendarReturn => {
  const [eventToDelete, setEventToDelete] = useState<EventContentArg | null>(null);

  const onDeleteCalendarEventAndRepairJob = useCallback(() => {
    if (eventToDelete) {
      calendarActions?.onDeleteCalendarEvent(eventToDelete.event.id, eventToDelete.event.extendedProps.repairJobId);

      setEventToDelete(null);
    }
  }, [calendarActions, eventToDelete]);

  const onSetCalendarEvent = useCallback((eventInfo: EventContentArg) => setEventToDelete(eventInfo), []);

  return {
    onSetCalendarEvent,
    onDeleteCalendarEventAndRepairJob,
  };
};
