import { PrismaClient } from '@prisma/client';

import { CalendarEvent, CreateCalendarEventInput } from '@/graphql/types/server/generated_types';

class CalendarEventService {
  private prisma;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getCalendarEvents(): Promise<CalendarEvent[]> {
    return this.prisma.calendarEvent.findMany();
  }

  async findCalendarEventById(id: string): Promise<CalendarEvent | null> {
    return await this.prisma.calendarEvent.findUnique({
      where: { id },
    });
  }

  async createCalendarEvent(calendarEventInput: CreateCalendarEventInput, repairJobId: string): Promise<CalendarEvent> {
    return this.prisma.calendarEvent.create({
      data: { ...calendarEventInput, repairJobId },
    });
  }

  async deleteCalendarEvent(id: string): Promise<CalendarEvent> {
    return await this.prisma.calendarEvent.delete({
      where: { id },
    });
  }
}

export default CalendarEventService;
