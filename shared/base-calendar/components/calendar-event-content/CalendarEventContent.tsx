import { useCallback, useMemo } from 'react';

import { EventContentArg } from '@fullcalendar/core';
import { useRouter } from 'next/router';

import { AppRoutes } from '@/types/enums';

import { getEventActionsConfig } from '../../config';
import { CalendarActions } from '../../types';

type CalendarEventContentProps = {
  eventInfo: EventContentArg;
  calendarActions?: CalendarActions;
  onSetCalendarEvent: (eventInfo: EventContentArg) => void;
};

const CalendarEventContent = ({ eventInfo, calendarActions, onSetCalendarEvent }: CalendarEventContentProps) => {
  const router = useRouter();

  const onHandleDeleteButtonClick = useCallback(
    (e: React.MouseEvent<SVGElement, MouseEvent>) => {
      e.stopPropagation();

      calendarActions?.onOpenDeleteEventModal();

      onSetCalendarEvent(eventInfo);
    },
    [calendarActions, eventInfo, onSetCalendarEvent]
  );

  const onHandleEventClick = () => {
    const { event: clickedEvent } = eventInfo;

    const repairJobId = clickedEvent.extendedProps?.repairJobId;

    router.push(`${AppRoutes.RepairJobTracking}/${repairJobId}`);
  };

  const eventActionsConfig = useMemo(
    () => getEventActionsConfig(onHandleDeleteButtonClick),
    [onHandleDeleteButtonClick]
  );

  return (
    <div className='h-full flex items-center p-2 bg-primary text-primary-foreground ' onClick={onHandleEventClick}>
      <div className='fc-event flex flex-col gap-1 pointer-events-none'>
        <h3 className='text-sm font-semibold' title={eventInfo.event.title}>
          {eventInfo.event.title}
        </h3>
        <h5 className='text-xs' title={eventInfo?.event?.extendedProps?.description}>
          {eventInfo?.event?.extendedProps?.description}
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
