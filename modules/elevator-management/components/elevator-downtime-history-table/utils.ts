import { formatDuration, intervalToDuration } from 'date-fns';

/**
 * Formats elevator downtime duration.
 * Examples: "2h 15m", "1d 3h", or "Ongoing (45m) when downtime is still active"
 */
export const formatElevatorDowntimeDuration = (startedAt: Date, endedAt?: Date | null): string => {
  // Use the actual end date, otherwise use 'now' for ongoing downtime
  const endDate = endedAt ?? new Date();

  const duration = intervalToDuration({ start: startedAt, end: endDate });

  // Get the full string (e.g., "1 day 2 hours")
  const fullDuration = formatDuration(duration, {
    format: ['days', 'hours', 'minutes'],
    zero: false,
    delimiter: ' ',
  });

  // Shorten the units (e.g., "1d 2h")
  // Default to '0m' to catch empty string
  const displayDuration =
    fullDuration
      .replace(/ days?/g, 'd')
      .replace(/ hours?/g, 'h')
      .replace(/ minutes?/g, 'm') || '0m';

  // If we have an endedAt date, the downtime is finished.
  // Otherwise, it's still happening.
  return endedAt ? displayDuration : `Ongoing (${displayDuration})`;
};
