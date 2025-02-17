import { PrismaClient } from '@prisma/client';
import { SupabaseClient } from '@supabase/supabase-js';

import AuthService from './Auth';
import CalendarEventService from './CalendarEventService';
import ElevatorService from './ElevatorService';
import RepairJobService from './RepairJobService';
import TechnicianService from './TechnicianService';

export const createDataSources = (prisma: PrismaClient, supabase?: SupabaseClient) => ({
  repairJob: new RepairJobService(prisma),
  technicianRecord: new TechnicianService(prisma),
  elevatorRecord: new ElevatorService(prisma),
  calendarEvent: new CalendarEventService(prisma),
  auth: new AuthService(prisma, supabase),
});

export type DataSources = ReturnType<typeof createDataSources>;
