import { endOfDay, isValid, startOfDay, toDate } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { get as _get } from 'lodash';
import { FieldErrors, FieldValues } from 'react-hook-form';

import { DropdownOption } from '@/shared/base-select/types';

import { TimePosition } from './types';

export const getNestedError = <T extends FieldValues>(
  errors: FieldErrors<T>,
  name: string
): FieldErrors<T>[string] | undefined => _get(errors, name) as FieldErrors<T>[string] | undefined;

export const convertQueryResponseToDropdownOptions = (options: string[]): DropdownOption<string>[] =>
  options.map((option: string) => ({
    value: option,
    label: option,
  }));

/**
 * Adjusts the date for all-day events based on the provided time position.
 *
 * @param date - The date to adjust.
 * @param allDay - Whether the event is an all-day event.
 * @param position - The position of the date ('start' or 'end').
 * @returns The adjusted date or undefined if the input date is invalid.
 */
export function adjustDateForAllDayEvent(
  date: Date | undefined,
  allDay: boolean,
  position: TimePosition
): Date | undefined {
  if (!date || !isValid(date)) return undefined;

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const zonedDate = toZonedTime(date, userTimeZone);

  // Adjust the date for all-day events:
  // - Set the start time to 00:00 if `allDay` is true and `position` is 'start'.
  // - Set the end time to 23:59 if `allDay` is true and `position` is 'end'.
  // - Keep the original date if `allDay` is false.
  const adjustedDate = allDay ? (position === 'start' ? startOfDay(zonedDate) : endOfDay(zonedDate)) : zonedDate;

  return isValid(adjustedDate) ? toDate(adjustedDate) : undefined;
}
