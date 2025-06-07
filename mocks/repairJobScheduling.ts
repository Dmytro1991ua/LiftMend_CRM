import { MockedResponse } from '@apollo/client/testing';
import { DateSelectArg, EventContentArg } from '@fullcalendar/core';
import { GraphQLError } from 'graphql';

import {
  CREATE_REPAIR_JOB_AND_CALENDAR_EVENT,
  GET_AVAILABLE_TECHNICIANS_FOR_ASSIGNMENT,
  GET_CALENDAR_EVENTS,
} from '@/graphql/schemas';
import {
  CreateRepairJobAndCalendarEventMutation,
  GetAvailableTechniciansForAssignmentQuery,
  GetCalendarEventsQuery,
} from '@/graphql/types/client/generated_types';

export const mockAvailableTechnician = {
  id: 'test-id-1',
  name: 'Charles Robinson',
};

export const mockSelectedDateRange = {
  start: '2025-05-09T21:00:00.000Z',
  end: '2025-05-10T21:00:00.000Z',
  startStr: '2025-05-10',
  endStr: '2025-05-11',
  allDay: true,
  jsEvent: {
    isTrusted: true,
  },
  view: {
    type: 'dayGridMonth',
    dateEnv: {
      timeZone: 'local',
      canComputeOffset: true,
      calendarSystem: {},
      locale: {
        codeArg: 'en',
        codes: ['en'],
        week: {
          dow: 0,
          doy: 4,
        },
        simpleNumberFormat: {},
        options: {
          direction: 'ltr',
          buttonText: {
            prev: 'prev',
            next: 'next',
            prevYear: 'prev year',
            nextYear: 'next year',
            year: 'year',
            today: 'today',
            month: 'month',
            week: 'week',
            day: 'day',
            list: 'list',
          },
          weekText: 'W',
          weekTextLong: 'Week',
          closeHint: 'Close',
          timeHint: 'Time',
          eventHint: 'Event',
          allDayText: 'all-day',
          moreLinkText: 'more',
          noEventsText: 'No events to display',
          buttonHints: {
            prev: 'Previous $0',
            next: 'Next $0',
          },
          viewHint: '$0 view',
          navLinkHint: 'Go to $0',
        },
      },
      weekDow: 0,
      weekDoy: 4,
      weekText: 'W',
      weekTextLong: 'Week',
      cmdFormatter: null,
      defaultSeparator: ' - ',
    },
  },
} as unknown as DateSelectArg;

export const mockCalendarEventInfo = {
  event: {
    allDay: true,
    title: 'Inspection Repair Job',
    start: '2025-01-20',
    end: '2025-01-23',
    id: '9cc89880-6731-4388-adac-646a8761059a',
    extendedProps: {
      description: 'Repair Job for Panoramic Lift at Cityscape Residences - Event Stage',
      repairJobId: 'd550fa3e-19cd-4f2b-bfb4-2ce527e0dc06',
    },
  },
  view: {
    type: 'dayGridMonth',
    dateEnv: {
      timeZone: 'local',
      canComputeOffset: true,
      calendarSystem: {},
      locale: {
        codeArg: 'en',
        codes: ['en'],
        week: {
          dow: 0,
          doy: 4,
        },
        simpleNumberFormat: {},
        options: {
          direction: 'ltr',
          buttonText: {
            prev: 'prev',
            next: 'next',
            prevYear: 'prev year',
            nextYear: 'next year',
            year: 'year',
            today: 'today',
            month: 'month',
            week: 'week',
            day: 'day',
            list: 'list',
          },
          weekText: 'W',
          weekTextLong: 'Week',
          closeHint: 'Close',
          timeHint: 'Time',
          eventHint: 'Event',
          allDayText: 'all-day',
          moreLinkText: 'more',
          noEventsText: 'No events to display',
          buttonHints: {
            prev: 'Previous $0',
            next: 'Next $0',
          },
          viewHint: '$0 view',
          navLinkHint: 'Go to $0',
        },
      },
      weekDow: 0,
      weekDoy: 4,
      weekText: 'W',
      weekTextLong: 'Week',
      cmdFormatter: null,
      defaultSeparator: ' - ',
    },
  },
  timeText: '',
  textColor: '',
  backgroundColor: '',
  borderColor: '',
  isDraggable: false,
  isStartResizable: false,
  isEndResizable: false,
  isMirror: false,
  isStart: true,
  isEnd: true,
  isPast: true,
  isFuture: false,
  isToday: false,
  isSelected: false,
  isDragging: false,
  isResizing: false,
} as unknown as EventContentArg;

export const mockAvailableTechniciansResponse: MockedResponse<GetAvailableTechniciansForAssignmentQuery> = {
  request: {
    query: GET_AVAILABLE_TECHNICIANS_FOR_ASSIGNMENT,
  },
  result: {
    data: {
      getAvailableTechniciansForAssignment: [{ ...mockAvailableTechnician, __typename: 'TechnicianRecord' }],
    },
    errors: [],
  },
};

const mockNewRepairJobInput = {
  buildingName: 'Bluewater Hotel',
  elevatorLocation: 'Restaurant',
  elevatorType: 'Eco-Friendly Elevator',
  endDate: '2025-05-14T20:59:59.999Z',
  jobDetails: 'asdasdasdasd',
  jobPriority: 'Low',
  jobType: 'Emergency',
  startDate: '2025-05-12T21:00:00.000Z',
  technicianName: 'Chloe Carter',
};

export const mockNewCalendarInput = {
  allDay: true,
  description: 'Repair Job for Eco-Friendly Elevator at Bluewater Hotel - Restaurant',
  end: '2025-05-14T20:59:59.999Z',
  start: '2025-05-12T21:00:00.000Z',
  title: 'Emergency Repair Job',
};

export const mockRepairJob = {
  id: '7fdfd63f-d091-4fa6-8194-cc986e7e1848',
  jobType: 'Emergency',
  jobDetails: 'asdasdasdasd',
  jobPriority: 'Low',
  elevatorType: 'Eco-Friendly Elevator',
  buildingName: 'Bluewater Hotel',
  elevatorLocation: 'Restaurant',
  technicianName: 'Chloe Carter',
  startDate: '2025-05-12T21:00:00.000Z',
  endDate: '2025-05-14T20:59:59.999Z',
  calendarEventId: '88d41b40-0331-4d29-b1cd-e59528284fce',
  actualEndDate: null,
  isOverdue: false,
};
export const mockCalendarEvent = {
  id: '88d41b40-0331-4d29-b1cd-e59528284fce',
  title: 'Emergency Repair Job',
  start: '2025-05-12T21:00:00.000Z',
  end: '2025-05-14T20:59:59.999Z',
  description: 'Repair Job for Eco-Friendly Elevator at Bluewater Hotel - Restaurant',
  allDay: true,
  repairJobId: '7fdfd63f-d091-4fa6-8194-cc986e7e1848',
};

export const mockCreateRepairJobAndCalendarEventResponse: MockedResponse<CreateRepairJobAndCalendarEventMutation> = {
  request: {
    query: CREATE_REPAIR_JOB_AND_CALENDAR_EVENT,
    variables: {
      repairJobInput: mockNewRepairJobInput,
      calendarEventInput: mockNewCalendarInput,
    },
  },
  result: {
    data: {
      createRepairJobAndEvent: {
        repairJob: { ...mockRepairJob, __typename: 'RepairJob' },
        calendarEvent: { ...mockCalendarEvent, __typename: 'CalendarEvent' },
        __typename: 'ScheduledEventAndRepairJobResponse',
      },
    },
    errors: [],
  },
};

export const mockCreateRepairJobAndCalendarEventGQLErrorResponse: MockedResponse<CreateRepairJobAndCalendarEventMutation> =
  {
    request: {
      query: CREATE_REPAIR_JOB_AND_CALENDAR_EVENT,
      variables: {
        repairJobInput: mockNewRepairJobInput,
        calendarEventInput: mockNewCalendarInput,
      },
    },
    result: {
      data: undefined,
      errors: [new GraphQLError('Test GQL error')],
    },
  };

export const mockCreateRepairJobAndCalendarEventNetworkErrorResponse = {
  request: {
    query: CREATE_REPAIR_JOB_AND_CALENDAR_EVENT,
    variables: {
      repairJobInput: mockNewRepairJobInput,
      calendarEventInput: mockNewCalendarInput,
    },
  },
  result: {
    data: undefined,
    error: new Error('Network Error occurs'),
  },
};

export const mockCalendarEventsResponse: MockedResponse<GetCalendarEventsQuery> = {
  request: {
    query: GET_CALENDAR_EVENTS,
  },
  result: {
    data: {
      getCalendarEvents: [{ ...mockCalendarEvent, __typename: 'CalendarEvent' }],
    },
    errors: [],
  },
};
