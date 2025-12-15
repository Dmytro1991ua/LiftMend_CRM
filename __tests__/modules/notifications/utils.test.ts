import { format, isToday, isYesterday, startOfDay, subDays } from 'date-fns';

import { getNotificationDayLabel, groupNotificationsByDate } from '@/modules/notifications/utils';
import { Notification } from '@/shared/types';

jest.mock('date-fns', () => {
  const original = jest.requireActual('date-fns');
  return {
    ...original,
    isToday: jest.fn(),
    isYesterday: jest.fn(),
    format: jest.fn(original.format),
  };
});

describe('getNotificationDayLabel', () => {
  const mockedIsToday = isToday as jest.Mock;
  const mockedIsYesterday = isYesterday as jest.Mock;
  const mockedFormat = format as jest.Mock;
  const mockDate = new Date();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return "Today" label when the date is today', () => {
    mockedIsToday.mockReturnValue(true);
    mockedIsYesterday.mockReturnValue(false);

    const result = getNotificationDayLabel(mockDate);

    expect(result).toBe('Today');
    expect(mockedIsToday).toHaveBeenCalledWith(mockDate);
    expect(mockedIsYesterday).not.toHaveBeenCalled();
  });

  it('should return "Yesterday" label when the date is yesterday', () => {
    mockedIsToday.mockReturnValue(false);
    mockedIsYesterday.mockReturnValue(true);

    const result = getNotificationDayLabel(mockDate);

    expect(result).toBe('Yesterday');
    expect(mockedIsToday).toHaveBeenCalledWith(mockDate);
    expect(mockedIsYesterday).toHaveBeenCalledWith(mockDate);
  });

  it('should return formatted date when not today or yesterday', () => {
    const mockDate = new Date('2025-12-01T12:00:00Z');

    mockedIsToday.mockReturnValue(false);
    mockedIsYesterday.mockReturnValue(false);
    mockedFormat.mockReturnValue('01 December');

    const result = getNotificationDayLabel(mockDate);

    expect(result).toBe('01 December');
    expect(mockedIsToday).toHaveBeenCalledWith(mockDate);
    expect(mockedIsYesterday).toHaveBeenCalledWith(mockDate);
    expect(mockedFormat).toHaveBeenCalledWith(mockDate, 'dd MMMM');
  });
});

describe('groupNotificationsByDate', () => {
  const mockDate = new Date();
  const mockYesterday = subDays(startOfDay(mockDate), 1);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty array when notifications are empty', () => {
    const result = groupNotificationsByDate([]);

    expect(result).toEqual([]);
  });

  it('should group a single notification', () => {
    const mockNotification = {
      id: '1',
      createdAt: mockDate.toISOString(),
      message: 'Hello',
    } as unknown as Notification;

    const result = groupNotificationsByDate([mockNotification]);

    expect(result).toEqual([
      {
        label: getNotificationDayLabel(mockDate),
        items: [mockNotification],
      },
    ]);
  });

  it('should groups notifications created today', () => {
    const notifications = [
      { id: '1', createdAt: mockDate.toISOString(), message: 'Today notification' },
      { id: '2', createdAt: mockDate.toISOString(), message: 'Another today notification' },
    ] as unknown as Notification[];

    const result = groupNotificationsByDate(notifications);

    expect(result.length).toBe(1);
    expect(result[0].label).toBe(getNotificationDayLabel(mockDate));
    expect(result[0].items.map((n) => n.id)).toEqual(['1', '2']);
  });

  it('groups notifications created yesterday', () => {
    const notifications = [
      { id: '1', createdAt: mockYesterday.toISOString(), message: 'Yesterday notification' },
      { id: '2', createdAt: mockYesterday.toISOString(), message: 'Another yesterday notification' },
    ] as unknown as Notification[];

    const result = groupNotificationsByDate(notifications);

    expect(result.length).toBe(1);
    expect(result[0].label).toBe(getNotificationDayLabel(mockYesterday));
    expect(result[0].items.map((n) => n.id)).toEqual(['1', '2']);
  });

  it('groups notifications on arbitrary past dates', () => {
    const mockDate1 = new Date('2025-12-01T10:00:00Z');
    const mockDate2 = new Date('2025-12-02T12:00:00Z');

    const mockNotifications = [
      { id: '1', createdAt: mockDate1.toISOString(), message: 'Old 1' },
      { id: '2', createdAt: mockDate2.toISOString(), message: 'Old 2' },
    ] as unknown as Notification[];

    const result = groupNotificationsByDate(mockNotifications);

    expect(result.length).toBe(2);
    expect(result[0].label).toBe(getNotificationDayLabel(mockDate1));
    expect(result[0].items).toEqual([mockNotifications[0]]);
    expect(result[1].label).toBe(getNotificationDayLabel(mockDate2));
    expect(result[1].items).toEqual([mockNotifications[1]]);
  });
});
