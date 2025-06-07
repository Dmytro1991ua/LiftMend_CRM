import { useMemo } from 'react';

import { ToolbarInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listMonthPlugin from '@fullcalendar/list';
import Fullcalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Circles } from 'react-loader-spinner';

import QueryResponse from '../query-response';

import CalendarEventContent from './components/calendar-event-content';
import { getEventModalsConfig } from './config';
import { DEFAULT_CALENDAR_HEADER_TOOLBAR_CONFIG, DEFAULT_CALENDAR_VIEW } from './constants';
import { useBaseCalendar, useFetchCalendarEvents } from './hooks';
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
  const { onDeleteCalendarEventAndRepairJob, onSetCalendarEvent } = useBaseCalendar({ calendarActions });

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

  return (
    <>
      <QueryResponse
        errorDescription={error}
        errorMessage='Failed to fetch Calendar Events'
        isErrorOccurred={!!error}
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
        {!loading ? (
          <Fullcalendar
            dayMaxEvents={2}
            editable={false}
            eventContent={(eventInfo) => (
              <CalendarEventContent
                calendarActions={calendarActions}
                eventInfo={eventInfo}
                onSetCalendarEvent={onSetCalendarEvent}
              />
            )}
            events={events}
            headerToolbar={headerToolbar}
            height={calendarHeight}
            initialView={calendarView}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listMonthPlugin]}
            select={calendarActions?.onHandleDateClick}
            selectMirror={true}
            selectable={true}
          />
        ) : null}
      </div>
      {modalsConfig.map(({ id, content }) => (
        <div key={id}>{content}</div>
      ))}
    </>
  );
};

export default BaseCalendar;
