import { useCallback, useMemo } from 'react';

import { EventContentArg } from '@fullcalendar/core';

import { useBaseToast } from '@/shared/hooks';
import { BaseToastVariant } from '@/shared/hooks/useBaseToast/types';

import { CalendarActions } from '../../types';
import { getEventActionsConfig } from '../../utils';

type CalendarEventContentProps = {
  eventInfo: EventContentArg;
  calendarActions?: CalendarActions;
  onSetCalendarEvent: (eventInfo: EventContentArg) => void;
};

const CalendarEventContent = ({ eventInfo, calendarActions, onSetCalendarEvent }: CalendarEventContentProps) => {
  const { baseToast } = useBaseToast(BaseToastVariant.Info);

  const onHandleEditButtonClick = useCallback(
    (e: React.MouseEvent<SVGElement, MouseEvent>) => {
      e.stopPropagation();
      baseToast('Not Implemented yet', '');
    },
    [baseToast]
  );

  const onHandleDeleteButtonClick = useCallback(
    (e: React.MouseEvent<SVGElement, MouseEvent>) => {
      e.stopPropagation();

      calendarActions?.onOpenDeleteEventModalOpen();

      onSetCalendarEvent(eventInfo);
    },
    [calendarActions, eventInfo, onSetCalendarEvent]
  );

  const eventActionsConfig = useMemo(
    () => getEventActionsConfig(onHandleEditButtonClick, onHandleDeleteButtonClick),
    [onHandleEditButtonClick, onHandleDeleteButtonClick]
  );

  return (
    <div className='h-full flex items-center p-2 bg-primary text-primary-foreground '>
      <div className='fc-event flex flex-col gap-1 pointer-events-none'>
        <h3 className='text-sm font-semibold' title={eventInfo?.event?.title}>
          {eventInfo?.event?.title}
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
