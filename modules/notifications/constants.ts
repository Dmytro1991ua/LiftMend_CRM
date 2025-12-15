export const DEFAULT_ERROR_RESPONSE_MESSAGE = 'Failed to fetch notifications';
export const DEFAULT_EMPTY_NOTIFICATION_PAGE_MESSAGE = 'You have no notifications';
export const READ_NOTIFICATION_STYLE = 'border-gray-200 bg-gray-50 text-gray-500';
export const UNREAD_NOTIFICATION_STYLES: Record<string, string> = {
  Overdue: 'border-red-500 bg-red-50 text-red-800',
  Upcoming: 'border-blue-500 bg-blue-50 text-blue-800',
  Urgent: 'border-yellow-500 bg-yellow-50 text-yellow-800',
};
