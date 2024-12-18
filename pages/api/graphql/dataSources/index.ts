import { PrismaClient } from '@prisma/client';

import CalendarEventService from './CalendarEventService';
import ElevatorService from './ElevatorService';
import RepairJobService from './RepairJobService';
import TechnicianService from './TechnicianService';

export const createDataSources = (prisma: PrismaClient) => ({
  repairJob: new RepairJobService(prisma),
  technicianRecord: new TechnicianService(prisma),
  elevatorRecord: new ElevatorService(prisma),
  calendarEvent: new CalendarEventService(prisma),
});

export type DataSources = ReturnType<typeof createDataSources>;
