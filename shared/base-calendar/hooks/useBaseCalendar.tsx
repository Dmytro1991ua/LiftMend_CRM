import { useCallback, useMemo, useState } from 'react';

import { EventContentArg } from '@fullcalendar/core';

import { getEventModalsConfig } from '../config';
import { CalendarActions } from '../types';

type UseBaseCalendarProps = {
  calendarActions?: CalendarActions;
};

type UseBaseCalendarReturn = {
  onSetCalendarEvent: (eventInfo: EventContentArg) => void;
  modalsConfig: ReturnType<typeof getEventModalsConfig>;
};

const useBaseCalendar = ({ calendarActions }: UseBaseCalendarProps): UseBaseCalendarReturn => {
  const [eventToDelete, setEventToDelete] = useState<EventContentArg | null>(null);

  const onDeleteCalendarEventAndRepairJob = useCallback(() => {
    if (eventToDelete) {
      calendarActions?.onDeleteCalendarEvent(eventToDelete.event.id, eventToDelete.event.extendedProps.repairJobId);

      setEventToDelete(null);
    }
  }, [calendarActions, eventToDelete]);

  const onSetCalendarEvent = useCallback((eventInfo: EventContentArg) => setEventToDelete(eventInfo), []);

  const modalsConfig = useMemo(
    () =>
      getEventModalsConfig({
        isDeleteEventModalOpen: calendarActions?.isDeleteEventModalOpen,
        onCloseDeleteEventModal: calendarActions?.onCloseDeleteEventModal,
        onDeleteCalendarEventAndRepairJob,
        isLoading: calendarActions?.isLoading,
      }),
    [calendarActions, onDeleteCalendarEventAndRepairJob]
  );

  return {
    onSetCalendarEvent,
    modalsConfig,
  };
};

export default useBaseCalendar;
