import { useMemo } from 'react';

import { useQuery } from '@apollo/client';

import { GET_CALENDAR_EVENTS } from '@/graphql/schemas';
import {
  CalendarEvent,
  Get_Calendar_EventsQuery,
  Get_Calendar_EventsQueryVariables,
} from '@/graphql/types/client/generated_types';

type UseFetchCalendarEvents = {
  events: CalendarEvent[];
  loading: boolean;
  error?: string;
};

const useFetchCalendarEvents = (): UseFetchCalendarEvents => {
  const { data, error, loading } = useQuery<Get_Calendar_EventsQuery, Get_Calendar_EventsQueryVariables>(
    GET_CALENDAR_EVENTS,
    {
      fetchPolicy: 'cache-first',
      nextFetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    }
  );

  const calendarEvents = useMemo(() => data?.getCalendarEvents?.map(({ __typename, ...event }) => event) ?? [], [data]);

  return {
    events: calendarEvents,
    loading,
    error: error?.message,
  };
};

export default useFetchCalendarEvents;
