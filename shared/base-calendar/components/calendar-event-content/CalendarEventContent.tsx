import { useCallback, useMemo } from 'react';

import { EventContentArg } from '@fullcalendar/core';
import { useRouter } from 'next/router';

import { AppRoutes } from '@/types/enums';

import { getEventActionsConfig } from '../../config';
import { CalendarActions } from '../../types';

export type CalendarEventContentProps = {
  eventInfo: EventContentArg;
  calendarActions?: CalendarActions;
  onSetCalendarEvent: (eventInfo: EventContentArg) => void;
};

const CalendarEventContent = ({ eventInfo, calendarActions, onSetCalendarEvent }: CalendarEventContentProps) => {
  const router = useRouter();

  const calendarEventTitle = eventInfo.event.title;
  const calendarEventDescription = eventInfo?.event?.extendedProps?.description;

  const onHandleDeleteButtonClick = useCallback(
    (e: React.MouseEvent<SVGElement, MouseEvent>) => {
      e.stopPropagation();

      calendarActions?.onOpenDeleteEventModal();

      onSetCalendarEvent(eventInfo);
    },
    [calendarActions, eventInfo, onSetCalendarEvent]
  );

  const onHandleEventClick = useCallback(() => {
    const { event: clickedEvent } = eventInfo;

    const repairJobId = clickedEvent.extendedProps?.repairJobId;

    router.push(`${AppRoutes.RepairJobScheduling}/${repairJobId}`);
  }, [eventInfo, router]);

  const eventActionsConfig = useMemo(
    () => getEventActionsConfig(onHandleDeleteButtonClick),
    [onHandleDeleteButtonClick]
  );

  return (
    <div
      className='h-full flex items-center p-2 bg-primary text-primary-foreground '
      data-testid='calendar-event-content'
      onClick={onHandleEventClick}>
      <div className='fc-event flex flex-col gap-1 pointer-events-none'>
        <h3 className='text-sm font-semibold' title={calendarEventTitle}>
          {calendarEventTitle}
        </h3>
        <h5 className='text-xs' title={calendarEventDescription}>
          {calendarEventDescription}
        </h5>
      </div>
      <span className='flex ml-auto'>
        {eventActionsConfig.map(({ id, content }) => (
          <div key={id}>{content}</div>
        ))}
      </span>
    </div>
  );
};

export default CalendarEventContent;
