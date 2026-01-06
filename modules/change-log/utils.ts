import { isValid, parseISO } from 'date-fns';

import { formatDate } from '@/shared/utils';

import { EMPTY_CHANGE_LOG_VALUE } from './constants';

/**
 * Converts an object into a single-line string for display in the change log.
 * Example: { status: "Read", readAt: "2026-01-05" } → "status: Read, readAt: 2026-01-05"
 */
export const formatChangeLogObjectValue = (object: object): string => {
  return Object.entries(object as Record<string, unknown>)
    .map(([key, val]) => `${key}: ${String(val)}`)
    .join(', ');
};

/**
 * Formats a change log timestamp into a human-readable local date/time string.
 * Returns a placeholder if the value is null or invalid.
 */
export const formattedChangeLogDate = (createdAt: string | null) => {
  if (!createdAt) return EMPTY_CHANGE_LOG_VALUE;

  const date = parseISO(createdAt);

  if (isValid(date)) return formatDate(date, true, true);

  return createdAt;
};

/**
 * Formats a value from the change log for display in the UI.
 *
 * Handles common cases like null, dates, arrays, and objects,
 * ensuring the table shows readable, consistent values.
 */
export const formatChangeLogValue = (value: unknown): string => {
  if (value === null || value === undefined) return EMPTY_CHANGE_LOG_VALUE;

  if (typeof value === 'boolean' || typeof value === 'number') return String(value);

  if (typeof value === 'string') {
    return formattedChangeLogDate(value);
  }

  if (Array.isArray(value)) return value.map(String).join(', ');

  if (typeof value === 'object') {
    try {
      return formatChangeLogObjectValue(value);
    } catch {
      return EMPTY_CHANGE_LOG_VALUE;
    }
  }

  return String(value);
};
