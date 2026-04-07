import { PrismaClient } from '@prisma/client';
import { SupabaseClient } from '@supabase/supabase-js';

import AuthService from '@/pages/api/graphql/dataSources/AuthService';
import CalendarEventService from '@/pages/api/graphql/dataSources/CalendarEventService';
import ChangeLogService from '@/pages/api/graphql/dataSources/ChangeLogService';
import ElevatorService from '@/pages/api/graphql/dataSources/ElevatorService';
import NotificationService from '@/pages/api/graphql/dataSources/NotificationService';
import RepairJobService from '@/pages/api/graphql/dataSources/RepairJobService';
import StorageService from '@/pages/api/graphql/dataSources/StorageService';
import TechnicianService from '@/pages/api/graphql/dataSources/TechnicianService';
import UserService from '@/pages/api/graphql/dataSources/UserService';

jest.mock('@/pages/api/graphql/dataSources/AuthService');
jest.mock('@/pages/api/graphql/dataSources/CalendarEventService');
jest.mock('@/pages/api/graphql/dataSources/ElevatorService');
jest.mock('@/pages/api/graphql/dataSources/RepairJobService');
jest.mock('@/pages/api/graphql/dataSources/TechnicianService');
jest.mock('@/pages/api/graphql/dataSources/UserService');
jest.mock('@/pages/api/graphql/dataSources/NotificationService');
jest.mock('@/pages/api/graphql/dataSources/ChangeLogService');
jest.mock('@/pages/api/graphql/dataSources/StorageService');

export const createDataSourcesMock = (prisma: PrismaClient, supabase?: SupabaseClient) => ({
  repairJob: new RepairJobService(prisma) as jest.Mocked<RepairJobService>,
  technicianRecord: new TechnicianService(prisma) as jest.Mocked<TechnicianService>,
  elevatorRecord: new ElevatorService(prisma) as jest.Mocked<ElevatorService>,
  calendarEvent: new CalendarEventService(prisma) as jest.Mocked<CalendarEventService>,
  auth: new AuthService(prisma, supabase) as jest.Mocked<AuthService>,
  user: new UserService(prisma, supabase) as jest.Mocked<UserService>,
  notification: new NotificationService(prisma) as jest.Mocked<NotificationService>,
  changeLog: new ChangeLogService(prisma) as jest.Mocked<ChangeLogService>,
  storageService: new StorageService(supabase) as jest.Mocked<StorageService>,
});

export default createDataSourcesMock;
