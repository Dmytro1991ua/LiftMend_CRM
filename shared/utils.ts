import { ActiveRoute } from '@/types/type';

import { CalendarEventInfo, CalendarEventInfoPayload } from './types';

export const getCommonFormLabelErrorStyles = (hasError: boolean): string =>
  `text-sm font-bold ${hasError ? 'text-red-400' : ''}`;

export const removeTypeNamesFromObject = <T>(data: Record<string, unknown> | T[]): T => {
  // Use JSON.stringify to remove __typename and return the cleaned object
  return JSON.parse(JSON.stringify(data, (key, value) => (key === '__typename' ? undefined : value)));
};

export const removeTypeNamesFromArray = <T extends Record<string, unknown>>(data: T[]): T[] => {
  return data.map((item) => removeTypeNamesFromObject(item)) as T[];
};

export const getCalendarEventInfo = (payload: CalendarEventInfoPayload): CalendarEventInfo => {
  const { elevatorLocation, elevatorType, buildingName, jobType } = payload;

  return {
    description: `Repair Job for ${elevatorType} at ${buildingName} - ${elevatorLocation}`,
    title: `${jobType} Repair Job`,
  };
};

export const isRouteActive = ({ asPath, url, pathname }: ActiveRoute): boolean => {
  // Handle exact match for static routes
  if (asPath === url) return true;

  // Check if the route is a base route for a dynamic route
  const isBaseRouteForDynamic = asPath.startsWith(url) && pathname.includes('[[');

  // Handle dynamic routes by checking the base route
  if (pathname.includes('[') && asPath.startsWith(url)) return true;

  return isBaseRouteForDynamic;
};

export const logError = (error: Error, info: { componentStack: string }): void => {
  console.error(`Error: ${error}`);
  console.error(`Error message: ${error.message}`);
  console.error(`Error caused by: ${info.componentStack}`);
};

export const getItemsFromQuery = <T>(data?: { edges: { node: T }[] }): T[] => data?.edges.map(({ node }) => node) || [];
