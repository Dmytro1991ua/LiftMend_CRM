import { useMemo } from 'react';

import { useQuery } from '@apollo/client';

import { GET_REPAIR_JOB_SCHEDULED_DATA } from '@/graphql/schemas';
import {
  CalendarEvent,
  Get_Repair_Job_Scheduled_DataQuery,
  Get_Repair_Job_Scheduled_DataQueryVariables,
} from '@/graphql/types/client/generated_types';

type UseFetchCalendarEvents = {
  events: CalendarEvent[];
  loading: boolean;
  error?: string;
};

const useFetchCalendarEvents = (): UseFetchCalendarEvents => {
  const { data, error, loading } = useQuery<
    Get_Repair_Job_Scheduled_DataQuery,
    Get_Repair_Job_Scheduled_DataQueryVariables
  >(GET_REPAIR_JOB_SCHEDULED_DATA, {
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const calendarEvents = useMemo(() => data?.getCalendarEvents?.map(({ __typename, ...event }) => event) ?? [], [data]);

  return {
    events: calendarEvents,
    loading,
    error: error?.message,
  };
};

export default useFetchCalendarEvents;
