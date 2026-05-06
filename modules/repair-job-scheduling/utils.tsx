import { endOfDay, isValid, startOfDay, toDate } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

import { TimePosition } from './types';

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
