import { isEqual as _isEqual } from 'lodash';

import { ActiveRoute } from '@/types/type';

import { CalendarEventInfo, CalendarEventInfoPayload, ElevatorRecord } from './types';

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

export const getItemsFromQuery = <T>(data?: { edges?: { node: T }[] }): T[] => {
  if (!data?.edges) {
    return [];
  }

  return data.edges.map(({ node }) => node);
};

export const formatScheduledDate = (date?: Date | string | null) => (date instanceof Date ? date.toISOString() : date);

export const getFieldsToUpdateForMutation = <T extends object>(updatedObject: T, originalObject?: T): Partial<T> => {
  const fieldsToUpdate: Partial<T> = {};

  (Object.keys(updatedObject) as Array<keyof T>).forEach((key) => {
    const newValue = updatedObject[key];
    const originalValue = originalObject?.[key];

    if (!_isEqual(newValue, originalValue) && newValue !== null) {
      fieldsToUpdate[key] = newValue;
    }
  });

  return fieldsToUpdate;
};

export const getElevatorRecordInfo = (elevatorRecord: ElevatorRecord): CalendarEventInfo => {
  const { elevatorLocation, elevatorType, buildingName } = elevatorRecord;

  return {
    description: `Elevator Record of ${elevatorType} at ${buildingName} - ${elevatorLocation}`,
    title: `${elevatorType} Information`,
  };
};

export const getDeleteModalDescription = (title: string, description = '') =>
  `Are you sure you want to delete ${title} ${description}?`;

export const formatPhoneNumber = (phone?: string | null): string | null => {
  if (!phone) return null;

  return phone.startsWith('+') ? phone : `+${phone}`;
};
