import { useMemo } from 'react';

import { ToolbarInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listMonthPlugin from '@fullcalendar/list';
import Fullcalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';

import CalendarEventContent from './components/calendar-event-content';
import { DEFAULT_CALENDAR_HEADER_TOOLBAR_CONFIG, DEFAULT_CALENDAR_VIEW } from './constants';
import { useBaseCalendar } from './hooks';
import { getCalendarModalsConfig } from './utils';

type BaseCalendarProps = {
  headerToolbar?: ToolbarInput;
  calendarView?: string;
  calendarHeight?: string;
};

const BaseCalendar = ({
  headerToolbar = DEFAULT_CALENDAR_HEADER_TOOLBAR_CONFIG,
  calendarView = DEFAULT_CALENDAR_VIEW,
  calendarHeight,
}: BaseCalendarProps) => {
  const { isCreateEventModalOpen, onCloseCreateEventModalOpen, onHandleDateClick } = useBaseCalendar();

  const modalsConfig = useMemo(
    () => getCalendarModalsConfig(isCreateEventModalOpen, onCloseCreateEventModalOpen),
    [isCreateEventModalOpen, onCloseCreateEventModalOpen]
  );

  return (
    <div data-testid='calendar'>
      <Fullcalendar
        dayMaxEvents={true}
        editable={true}
        eventClick={(e) => console.log(e)}
        eventContent={(eventInfo) => <CalendarEventContent eventInfo={eventInfo} />}
        eventsSet={(events) => console.log(events)}
        headerToolbar={headerToolbar}
        height={calendarHeight}
        initialEvents={[
          {
            id: '123',
            title: 'All-day event',
            date: '2024-07-08',
          },
          {
            id: '12334',
            title: 'All-day event',
            date: '2024-07-07',
          },
        ]}
        initialView={calendarView}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listMonthPlugin]}
        select={onHandleDateClick}
        selectMirror={true}
        selectable={true}
      />
      {modalsConfig.map(({ id, content }) => (
        <div key={id}>{content}</div>
      ))}
    </div>
  );
};

export default BaseCalendar;
