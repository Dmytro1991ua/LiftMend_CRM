import { useCallback, useMemo } from 'react';

import { EventContentArg } from '@fullcalendar/core';

import { useBaseToast } from '@/shared/hooks';
import { BaseToastVariant } from '@/shared/hooks/useBaseToast/types';

import { CalendarActions } from '../../types';
import { getEventActionsConfig, getEventModalsConfig } from '../../utils';

type CalendarEventContentProps = {
  eventInfo: EventContentArg;
  calendarActions?: CalendarActions;
};

const CalendarEventContent = ({ eventInfo, calendarActions }: CalendarEventContentProps) => {
  const { baseToast } = useBaseToast(BaseToastVariant.Info);

  const onHandleEditButtonClick = useCallback(
    (e: React.MouseEvent<SVGElement, MouseEvent>) => {
      e.stopPropagation();
      baseToast('Not Implemented yet');
    },
    [baseToast]
  );

  const onHandleDeleteButtonClick = useCallback(
    (e: React.MouseEvent<SVGElement, MouseEvent>) => {
      e.stopPropagation();
      calendarActions?.onOpenDeleteEventModalOpen();
    },
    [calendarActions]
  );

  const eventActionsConfig = useMemo(
    () => getEventActionsConfig(onHandleEditButtonClick, onHandleDeleteButtonClick),
    [onHandleEditButtonClick, onHandleDeleteButtonClick]
  );

  const modalsConfig = useMemo(
    () => getEventModalsConfig(calendarActions?.isDeleteEventModalOpen, calendarActions?.onCloseDeleteEventModalOpen),
    [calendarActions]
  );

  return (
    <div className='flex items-center p-2 bg-primary text-primary-foreground '>
      <h6>{eventInfo.timeText}&nbsp;</h6>
      <h3>{eventInfo.event.title}</h3>
      <span className='flex ml-auto'>
        {eventActionsConfig.map(({ id, content }) => (
          <div key={id}>{content}</div>
        ))}
        {modalsConfig.map(({ id, content }) => (
          <div key={id}>{content}</div>
        ))}
      </span>
    </div>
  );
};

export default CalendarEventContent;
