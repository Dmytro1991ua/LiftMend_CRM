import { PrismaClient } from '@prisma/client';
import { SupabaseClient } from '@supabase/supabase-js';

import AuthService from './AuthService';
import CalendarEventService from './CalendarEventService';
import ChangeLogService from './ChangeLogService';
import ElevatorService from './ElevatorService';
import NotificationService from './NotificationService';
import RepairJobService from './RepairJobService';
import TechnicianService from './TechnicianService';
import UserService from './UserService';

export const createDataSources = (prisma: PrismaClient, supabase?: SupabaseClient) => ({
  repairJob: new RepairJobService(prisma),
  technicianRecord: new TechnicianService(prisma),
  elevatorRecord: new ElevatorService(prisma),
  calendarEvent: new CalendarEventService(prisma),
  auth: new AuthService(prisma, supabase),
  user: new UserService(prisma, supabase),
  notification: new NotificationService(prisma),
  changeLog: new ChangeLogService(prisma),
});

export type DataSources = ReturnType<typeof createDataSources>;
