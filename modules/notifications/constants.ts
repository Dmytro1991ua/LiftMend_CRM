export const DEFAULT_ERROR_RESPONSE_MESSAGE = 'Failed to fetch notifications';
export const DEFAULT_EMPTY_NOTIFICATION_PAGE_MESSAGE = 'You have no notifications';
export const READ_NOTIFICATION_STYLE = 'border-gray-200 bg-gray-50 text-gray-500';
export const UNREAD_NOTIFICATION_STYLES: Record<string, string> = {
  Overdue: 'border-red-500 bg-red-50 text-red-800',
  Upcoming: 'border-blue-500 bg-blue-50 text-blue-800',
  Urgent: 'border-yellow-500 bg-yellow-50 text-yellow-800',
};
export const MARK_NOTIFICATION_AS_READ_ERROR_MESSAGE = 'Failed to mark notification as read';
export const MARK_ALL_NOTIFICATIONS_AS_READ_ERROR_MESSAGE = 'Failed to mark all notification as read';
export const DEFAULT_BADGE_STYLE = 'bg-gray-200 text-gray-600';
export const NOTIFICATION_BADGE_STYLES: Record<string, string> = {
  Overdue: 'bg-red-100 text-red-700',
  Upcoming: 'bg-blue-100 text-blue-700',
  Urgent: 'bg-yellow-100 text-yellow-800',
};
export const DEFAULT_NOTIFICATIONS_DATE_RANGE_INFO_TOOLTIP_MESSAGE =
  'By default, the Notifications page shows entries from the current month. Use the date range to filter logs for other periods.';
