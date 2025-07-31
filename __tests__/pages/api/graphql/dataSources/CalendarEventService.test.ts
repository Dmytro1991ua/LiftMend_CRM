import { PrismaClient } from '@prisma/client';

import {
  mockCalendarEvent,
  mockCalendarEventId,
  mockNewCalendarInput,
  mockRepairJobId,
} from '@/mocks/repairJobScheduling';
import CalendarEventService from '@/pages/api/graphql/dataSources/CalendarEventService';

describe('CalendarEventService', () => {
  const prismaMock = {
    calendarEvent: {
      create: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  } as unknown as PrismaClient;

  const calendarEventService = new CalendarEventService(prismaMock);

  describe('getCalendarEvents', () => {
    it('should return available calendar events', async () => {
      (prismaMock.calendarEvent.findMany as jest.Mock).mockResolvedValue([mockCalendarEvent]);

      const result = await calendarEventService.getCalendarEvents();

      expect(result).toEqual([mockCalendarEvent]);
    });
  });

  describe('findCalendarEventById', () => {
    it('should return calendar event byt id', async () => {
      (prismaMock.calendarEvent.findUnique as jest.Mock).mockResolvedValue(mockCalendarEvent);

      const result = await calendarEventService.findCalendarEventById(mockCalendarEventId);

      expect(prismaMock.calendarEvent.findUnique).toHaveBeenCalledWith({
        where: { id: mockCalendarEventId },
      });
      expect(result).toEqual(mockCalendarEvent);
    });
  });

  describe('createCalendarEvent', () => {
    it('should create a new calendar event', async () => {
      (prismaMock.calendarEvent.create as jest.Mock).mockResolvedValue(mockCalendarEvent);

      const result = await calendarEventService.createCalendarEvent(mockNewCalendarInput, mockRepairJobId);

      expect(prismaMock.calendarEvent.create).toHaveBeenCalledWith({
        data: { ...mockNewCalendarInput, repairJobId: mockRepairJobId },
      });
      expect(result).toEqual(mockCalendarEvent);
    });
  });

  describe('deleteCalendarEvent', () => {
    it('should delete a calendar event by id', async () => {
      (prismaMock.calendarEvent.delete as jest.Mock).mockResolvedValue(mockCalendarEvent);

      const result = await calendarEventService.deleteCalendarEvent(mockCalendarEventId);

      expect(prismaMock.calendarEvent.delete).toHaveBeenCalledWith({
        where: { id: mockCalendarEventId },
      });
      expect(result).toEqual(mockCalendarEvent);
    });
  });
});
