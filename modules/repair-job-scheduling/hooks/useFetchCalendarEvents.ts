import { useMemo } from 'react';

import { useQuery } from '@apollo/client';

import { GET_CALENDAR_EVENTS } from '@/graphql/schemas';
import {
  CalendarEvent,
  GetCalendarEventsQuery,
  GetCalendarEventsQueryVariables,
} from '@/graphql/types/client/generated_types';
import { removeTypeNamesFromArray } from '@/shared/utils';

export type UseFetchCalendarEvents = {
  events: CalendarEvent[];
  loading: boolean;
  error?: string;
};

export const useFetchCalendarEvents = (): UseFetchCalendarEvents => {
  const { data, error, loading } = useQuery<GetCalendarEventsQuery, GetCalendarEventsQueryVariables>(
    GET_CALENDAR_EVENTS,
    {
      fetchPolicy: 'cache-first',
      nextFetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    }
  );

  const calendarEvents = useMemo(() => removeTypeNamesFromArray(data?.getCalendarEvents ?? []), [data]);

  return {
    events: calendarEvents,
    loading,
    error: error?.message,
  };
};
