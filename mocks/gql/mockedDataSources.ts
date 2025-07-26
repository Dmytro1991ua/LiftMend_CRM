import AuthService from '@/pages/api/graphql/dataSources/AuthService';
import CalendarEventService from '@/pages/api/graphql/dataSources/CalendarEventService';
import ElevatorService from '@/pages/api/graphql/dataSources/ElevatorService';
import RepairJobService from '@/pages/api/graphql/dataSources/RepairJobService';
import TechnicianService from '@/pages/api/graphql/dataSources/TechnicianService';
import UserService from '@/pages/api/graphql/dataSources/UserService';
import { PrismaClient } from '@prisma/client';
import { SupabaseClient } from '@supabase/supabase-js';

jest.mock('@/pages/api/graphql/dataSources/AuthService');
jest.mock('@/pages/api/graphql/dataSources/CalendarEventService');
jest.mock('@/pages/api/graphql/dataSources/ElevatorService');
jest.mock('@/pages/api/graphql/dataSources/RepairJobService');
jest.mock('@/pages/api/graphql/dataSources/TechnicianService');
jest.mock('@/pages/api/graphql/dataSources/UserService');

export const createDataSourcesMock = (prisma: PrismaClient, supabase?: SupabaseClient) => ({
  repairJob: new RepairJobService(prisma) as jest.Mocked<RepairJobService>,
  technicianRecord: new TechnicianService(prisma) as jest.Mocked<TechnicianService>,
  elevatorRecord: new ElevatorService(prisma) as jest.Mocked<ElevatorService>,
  calendarEvent: new CalendarEventService(prisma) as jest.Mocked<CalendarEventService>,
  auth: new AuthService(prisma, supabase) as jest.Mocked<AuthService>,
  user: new UserService(prisma, supabase) as jest.Mocked<UserService>,
});

export default createDataSourcesMock;
