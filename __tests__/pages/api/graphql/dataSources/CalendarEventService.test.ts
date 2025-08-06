import { calendarEventServicePrismaMock } from '@/mocks/gql/prismaMocks';
import {
  mockCalendarEvent,
  mockCalendarEventId,
  mockNewCalendarInput,
  mockRepairJobId,
} from '@/mocks/repairJobScheduling';
import CalendarEventService from '@/pages/api/graphql/dataSources/CalendarEventService';

describe('CalendarEventService', () => {
  const calendarEventService = new CalendarEventService(calendarEventServicePrismaMock);

  describe('getCalendarEvents', () => {
    it('should return available calendar events', async () => {
      (calendarEventServicePrismaMock.calendarEvent.findMany as jest.Mock).mockResolvedValue([mockCalendarEvent]);

      const result = await calendarEventService.getCalendarEvents();

      expect(result).toEqual([mockCalendarEvent]);
    });
  });

  describe('findCalendarEventById', () => {
    it('should return calendar event byt id', async () => {
      (calendarEventServicePrismaMock.calendarEvent.findUnique as jest.Mock).mockResolvedValue(mockCalendarEvent);

      const result = await calendarEventService.findCalendarEventById(mockCalendarEventId);

      expect(calendarEventServicePrismaMock.calendarEvent.findUnique).toHaveBeenCalledWith({
        where: { id: mockCalendarEventId },
      });
      expect(result).toEqual(mockCalendarEvent);
    });
  });

  describe('createCalendarEvent', () => {
    it('should create a new calendar event', async () => {
      (calendarEventServicePrismaMock.calendarEvent.create as jest.Mock).mockResolvedValue(mockCalendarEvent);

      const result = await calendarEventService.createCalendarEvent(mockNewCalendarInput, mockRepairJobId);

      expect(calendarEventServicePrismaMock.calendarEvent.create).toHaveBeenCalledWith({
        data: { ...mockNewCalendarInput, repairJobId: mockRepairJobId },
      });
      expect(result).toEqual(mockCalendarEvent);
    });
  });

  describe('deleteCalendarEvent', () => {
    it('should delete a calendar event by id', async () => {
      (calendarEventServicePrismaMock.calendarEvent.delete as jest.Mock).mockResolvedValue(mockCalendarEvent);

      const result = await calendarEventService.deleteCalendarEvent(mockCalendarEventId);

      expect(calendarEventServicePrismaMock.calendarEvent.delete).toHaveBeenCalledWith({
        where: { id: mockCalendarEventId },
      });
      expect(result).toEqual(mockCalendarEvent);
    });
  });
});
