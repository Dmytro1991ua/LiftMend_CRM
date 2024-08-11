import { ToolbarInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listMonthPlugin from '@fullcalendar/list';
import Fullcalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Circles } from 'react-loader-spinner';

import useFetchCalendarEvents from '@/modules/repair-job-tracking/hooks/useFetchCalendarEvents';

import QueryResponse from '../query-response';

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
  const { events, loading, error } = useFetchCalendarEvents();

  return (
    <>
      <QueryResponse
        errorDescription={error}
        errorMessage='Failed to fetch Calendar Events'
        loading={loading}
        loadingComponent={
          <Circles
            ariaLabel='bars-loading'
            color='#2563eb'
            height='80'
            visible={true}
            width='80'
            wrapperClass='h-full items-center justify-center'
          />
        }
      />
      <div data-testid='calendar'>
        <Fullcalendar
          dayMaxEvents={true}
          editable={false}
          eventClick={(e) => console.log(e)}
          eventContent={(eventInfo) => <CalendarEventContent calendarActions={calendarActions} eventInfo={eventInfo} />}
          events={events}
          eventsSet={(events) => console.log(events)}
          headerToolbar={headerToolbar}
          height={calendarHeight}
          initialView={calendarView}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listMonthPlugin]}
          select={calendarActions?.onHandleDateClick}
          selectMirror={true}
          selectable={true}
        />
      </div>
    </>
  );
};

export default BaseCalendar;
