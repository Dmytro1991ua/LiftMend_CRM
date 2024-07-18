import { ToolbarInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listMonthPlugin from '@fullcalendar/list';
import Fullcalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';

import CalendarEventContent from './components/calendar-event-content';
import { DEFAULT_CALENDAR_HEADER_TOOLBAR_CONFIG, DEFAULT_CALENDAR_VIEW } from './constants';
import { CalendarActions } from './types';

type BaseCalendarProps = {
  headerToolbar?: ToolbarInput;
  calendarView?: string;
  calendarHeight?: string;
  calendarActions?: CalendarActions;
};

const BaseCalendar = ({
  headerToolbar = DEFAULT_CALENDAR_HEADER_TOOLBAR_CONFIG,
  calendarView = DEFAULT_CALENDAR_VIEW,
  calendarHeight,
  calendarActions,
}: BaseCalendarProps) => {
  return (
    <div data-testid='calendar'>
      <Fullcalendar
        dayMaxEvents={true}
        editable={true}
        eventClick={(e) => console.log(e)}
        eventContent={(eventInfo) => <CalendarEventContent calendarActions={calendarActions} eventInfo={eventInfo} />}
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
        select={calendarActions?.onHandleDateClick}
        selectMirror={true}
        selectable={true}
      />
    </div>
  );
};

export default BaseCalendar;
