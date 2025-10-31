import {
  ElevatorRecordFormData,
  RepairJobConnection,
  TechnicianRecordConnection,
} from '@/graphql/types/server/generated_types';
import { mockElevatorRecordMetrics, mockRepairJobMetrics, mockTechnicianRecordMetrics } from '@/mocks/dashboardMetrics';
import { mockElevatorManagementDropdownOptions, mockTechnicalManagementDropdownOptions } from '@/mocks/dropdownOptions';
import {
  mockElevatorRecord,
  mockElevatorRecordId,
  mockedReturnedElevatorRecordsData,
} from '@/mocks/elevatorManagementMocks';
import getResolverToTest, { TestResolver } from '@/mocks/gql/getResolverToTest';
import createDataSourcesMock from '@/mocks/gql/mockedDataSources';
import {
  calendarEventServicePrismaMock,
  elevatorRecordServicePrismaMock,
  repairJobServicePrismaMock,
  technicianRecordPrismaMock,
  userServicePrismaMock,
} from '@/mocks/gql/prismaMocks';
import { userServiceSupabaseMock } from '@/mocks/gql/supabaseMocks';
import { mockCalendarEvent, mockRepairJobScheduledData } from '@/mocks/repairJobScheduling';
import {
  mockRepairJob,
  mockRepairJobId,
  mockReturnedRecentRepairJobsData,
  mockReturnedRepairJobsData,
  mockReturnedRepairJobsDataForElevatorMaintenance,
} from '@/mocks/repairJobTrackingMocks';
import {
  mockBenjaminHallRecord,
  mockBenjaminHallRecordId,
  mockJamesAndersonRecord,
  mockOliviaLewisRecord,
  mockedReturnedTechnicianRecordsData,
} from '@/mocks/technicianManagementMocks';
import { mockUser } from '@/mocks/userMocks';
import { DEFAULT_RECENT_JOBS_COUNT } from '@/pages/api/graphql/dataSources/constants';
import Query from '@/pages/api/graphql/resolvers/Query';

jest.mock('@/lib/supabase-service-role', () => ({
  supabaseServiceRole: {
    auth: {
      admin: {
        deleteUser: jest.fn().mockResolvedValue({ error: null }),
      },
    },
  },
}));

describe('Query', () => {
  describe('getDashboardMetrics', () => {
    let mockDataSources: ReturnType<typeof createDataSourcesMock>;

    let getDashboardMetricsResolver: TestResolver<typeof Query, 'getDashboardMetrics'>;

    beforeEach(() => {
      mockDataSources = createDataSourcesMock(repairJobServicePrismaMock);

      getDashboardMetricsResolver = getResolverToTest(Query, 'getDashboardMetrics', mockDataSources);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return dashboard metrics', async () => {
      mockDataSources.repairJob.getRepairJobsMetrics.mockResolvedValue(mockRepairJobMetrics);
      mockDataSources.elevatorRecord.getElevatorRecordsMetrics.mockResolvedValue(mockElevatorRecordMetrics);
      mockDataSources.technicianRecord.getTechnicianRecordsMetrics.mockResolvedValue(mockTechnicianRecordMetrics);

      const result = await getDashboardMetricsResolver();

      expect(mockDataSources.repairJob.getRepairJobsMetrics).toHaveBeenCalled();
      expect(mockDataSources.elevatorRecord.getElevatorRecordsMetrics).toHaveBeenCalled();
      expect(mockDataSources.technicianRecord.getTechnicianRecordsMetrics).toHaveBeenCalled();
      expect(result).toEqual({
        repairJobsMetrics: mockRepairJobMetrics,
        elevatorRecordsMetrics: mockElevatorRecordMetrics,
        technicianRecordsMetrics: mockTechnicianRecordMetrics,
      });
    });
  });

  describe('RepairJobService', () => {
    let mockDataSources: ReturnType<typeof createDataSourcesMock>;

    let getRepairJobScheduleDataResolver: TestResolver<typeof Query, 'getRepairJobScheduleData'>;
    let getRepairJobsResolver: TestResolver<typeof Query, 'getRepairJobs'>;
    let getRepairJobByIdResolver: TestResolver<typeof Query, 'getRepairJobById'>;
    let getElevatorDetailsByBuildingNameResolver: TestResolver<typeof Query, 'getElevatorDetailsByBuildingName'>;
    let getRecentRepairJobsResolver: TestResolver<typeof Query, 'getRecentRepairJobs'>;
    let getElevatorMentainanceHistoryResolver: TestResolver<typeof Query, 'getElevatorMentainanceHistory'>;

    beforeEach(() => {
      mockDataSources = createDataSourcesMock(repairJobServicePrismaMock);

      getRepairJobScheduleDataResolver = getResolverToTest(Query, 'getRepairJobScheduleData', mockDataSources);
      getRepairJobsResolver = getResolverToTest(Query, 'getRepairJobs', mockDataSources);
      getRepairJobByIdResolver = getResolverToTest(Query, 'getRepairJobById', mockDataSources);
      getElevatorDetailsByBuildingNameResolver = getResolverToTest(
        Query,
        'getElevatorDetailsByBuildingName',
        mockDataSources
      );
      getRecentRepairJobsResolver = getResolverToTest(Query, 'getRecentRepairJobs', mockDataSources);
      getElevatorMentainanceHistoryResolver = getResolverToTest(
        Query,
        'getElevatorMentainanceHistory',
        mockDataSources
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('getRepairJobScheduleData', () => {
      it('should return repair job scheduled data', async () => {
        mockDataSources.repairJob.getRepairJobScheduleData.mockResolvedValue(mockRepairJobScheduledData);

        const result = await getRepairJobScheduleDataResolver();

        expect(mockDataSources.repairJob.getRepairJobScheduleData).toHaveBeenCalled();
        expect(result).toEqual(mockRepairJobScheduledData);
      });
    });

    describe('getRepairJobs', () => {
      it('should return repair jobs data', async () => {
        mockDataSources.repairJob.getRepairJobs.mockResolvedValue(
          mockReturnedRepairJobsData.getRepairJobs as RepairJobConnection
        );

        const result = await getRepairJobsResolver();

        expect(mockDataSources.repairJob.getRepairJobs).toHaveBeenCalled();
        expect(result).toEqual(mockReturnedRepairJobsData.getRepairJobs);
      });
    });

    describe('getRepairJobById', () => {
      it('should return repair job by id', async () => {
        mockDataSources.repairJob.findRepairJobById.mockResolvedValue(mockRepairJob);

        const result = await getRepairJobByIdResolver({}, { id: mockRepairJobId });

        expect(mockDataSources.repairJob.findRepairJobById).toHaveBeenCalled();
        expect(result).toEqual(mockRepairJob);
      });
    });

    describe('getElevatorDetailsByBuildingName', () => {
      const mockElevatorDetails = {
        elevatorTypes: [mockElevatorRecord.elevatorType],
        elevatorLocations: [mockElevatorRecord.elevatorLocation],
      };

      it('should return elevator details by building name', async () => {
        mockDataSources.repairJob.getElevatorDetailsByBuildingName.mockResolvedValue(mockElevatorDetails);

        const result = await getElevatorDetailsByBuildingNameResolver(
          {},
          { buildingName: mockElevatorRecord.buildingName }
        );

        expect(mockDataSources.repairJob.getElevatorDetailsByBuildingName).toHaveBeenCalled();
        expect(result).toEqual(mockElevatorDetails);
      });
    });

    describe('getRecentRepairJobs', () => {
      it('should return recent repair jobs data', async () => {
        mockDataSources.repairJob.recentRepairJobs.mockResolvedValue(mockReturnedRecentRepairJobsData);

        const result = await getRecentRepairJobsResolver({}, { jobsCount: DEFAULT_RECENT_JOBS_COUNT });

        expect(mockDataSources.repairJob.recentRepairJobs).toHaveBeenCalledWith(DEFAULT_RECENT_JOBS_COUNT);
        expect(result).toEqual(mockReturnedRecentRepairJobsData);
      });
    });

    describe('getElevatorMentainanceHistory', () => {
      it('should return repair jobs data for elevator maintenance history', async () => {
        mockDataSources.repairJob.elevatorMentainanceHistory.mockResolvedValue(
          mockReturnedRepairJobsDataForElevatorMaintenance.getElevatorMentainanceHistory as RepairJobConnection
        );

        const result = await getElevatorMentainanceHistoryResolver();

        expect(mockDataSources.repairJob.elevatorMentainanceHistory).toHaveBeenCalled();
        expect(result).toEqual(mockReturnedRepairJobsDataForElevatorMaintenance.getElevatorMentainanceHistory);
      });
    });
  });

  describe('CalendarEventService', () => {
    let mockDataSources: ReturnType<typeof createDataSourcesMock>;

    let getCalendarEventsResolver: TestResolver<typeof Query, 'getCalendarEvents'>;

    beforeEach(() => {
      mockDataSources = createDataSourcesMock(calendarEventServicePrismaMock);

      getCalendarEventsResolver = getResolverToTest(Query, 'getCalendarEvents', mockDataSources);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return calendar events', async () => {
      mockDataSources.calendarEvent.getCalendarEvents.mockResolvedValue([mockCalendarEvent]);

      const result = await getCalendarEventsResolver();

      expect(mockDataSources.calendarEvent.getCalendarEvents).toHaveBeenCalled();
      expect(result).toEqual([mockCalendarEvent]);
    });
  });

  describe('ElevatorService', () => {
    let mockDataSources: ReturnType<typeof createDataSourcesMock>;

    let getElevatorRecordFormDataResolver: TestResolver<typeof Query, 'getElevatorRecordFormData'>;
    let getElevatorRecordsResolver: TestResolver<typeof Query, 'getElevatorRecords'>;
    let getElevatorRecordByIdResolver: TestResolver<typeof Query, 'getElevatorRecordById'>;

    beforeEach(() => {
      mockDataSources = createDataSourcesMock(elevatorRecordServicePrismaMock);

      getElevatorRecordFormDataResolver = getResolverToTest(Query, 'getElevatorRecordFormData', mockDataSources);
      getElevatorRecordsResolver = getResolverToTest(Query, 'getElevatorRecords', mockDataSources);
      getElevatorRecordByIdResolver = getResolverToTest(Query, 'getElevatorRecordById', mockDataSources);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('getElevatorRecordFormData', () => {
      it('should return elevator record form data', async () => {
        mockDataSources.elevatorRecord.getElevatorRecordFormData.mockResolvedValue(
          mockElevatorManagementDropdownOptions as unknown as ElevatorRecordFormData
        );

        const result = await getElevatorRecordFormDataResolver();

        expect(mockDataSources.elevatorRecord.getElevatorRecordFormData).toHaveBeenCalled();
        expect(result).toEqual(mockElevatorManagementDropdownOptions);
      });
    });

    describe('getElevatorRecords', () => {
      it('should return elevator records', async () => {
        mockDataSources.elevatorRecord.getElevatorRecords.mockResolvedValue(
          // @ts-ignore
          mockedReturnedElevatorRecordsData.getElevatorRecords
        );

        const result = await getElevatorRecordsResolver();

        expect(mockDataSources.elevatorRecord.getElevatorRecords).toHaveBeenCalled();
        expect(result).toEqual(mockedReturnedElevatorRecordsData.getElevatorRecords);
      });
    });

    describe('getElevatorRecordById', () => {
      it('should return elevator record by id', async () => {
        mockDataSources.elevatorRecord.findElevatorRecordById.mockResolvedValue(mockElevatorRecord);

        const result = await getElevatorRecordByIdResolver({}, { id: mockElevatorRecordId });

        expect(mockDataSources.elevatorRecord.findElevatorRecordById).toHaveBeenCalled();
        expect(result).toEqual(mockElevatorRecord);
      });
    });
  });

  describe('TechnicianService', () => {
    let mockDataSources: ReturnType<typeof createDataSourcesMock>;

    let getTechnicianRecordResolver: TestResolver<typeof Query, 'getTechnicianRecords'>;
    let getTechnicianRecordFormDataResolver: TestResolver<typeof Query, 'getTechnicianRecordFormData'>;
    let getTechnicianRecordByIdResolver: TestResolver<typeof Query, 'getTechnicianRecordById'>;
    let getAvailableTechniciansForAssignmentResolver: TestResolver<
      typeof Query,
      'getAvailableTechniciansForAssignment'
    >;

    beforeEach(() => {
      mockDataSources = createDataSourcesMock(technicianRecordPrismaMock);

      getTechnicianRecordResolver = getResolverToTest(Query, 'getTechnicianRecords', mockDataSources);
      getTechnicianRecordFormDataResolver = getResolverToTest(Query, 'getTechnicianRecordFormData', mockDataSources);
      getTechnicianRecordByIdResolver = getResolverToTest(Query, 'getTechnicianRecordById', mockDataSources);
      getAvailableTechniciansForAssignmentResolver = getResolverToTest(
        Query,
        'getAvailableTechniciansForAssignment',
        mockDataSources
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('getTechnicianRecords', () => {
      it('should return technician records', async () => {
        mockDataSources.technicianRecord.getTechnicianRecords.mockResolvedValue(
          mockedReturnedTechnicianRecordsData.getTechnicianRecords as TechnicianRecordConnection
        );

        const result = await getTechnicianRecordResolver();

        expect(mockDataSources.technicianRecord.getTechnicianRecords).toHaveBeenCalled();
        expect(result).toEqual(mockedReturnedTechnicianRecordsData.getTechnicianRecords);
      });
    });

    describe('getTechnicianRecordFormData', () => {
      it('should return technician record form data', async () => {
        mockDataSources.technicianRecord.getTechnicianRecordFormData.mockResolvedValue(
          mockTechnicalManagementDropdownOptions
        );

        const result = await getTechnicianRecordFormDataResolver();

        expect(mockDataSources.technicianRecord.getTechnicianRecordFormData).toHaveBeenCalled();
        expect(result).toEqual(mockTechnicalManagementDropdownOptions);
      });
    });

    describe('getTechnicianRecordById', () => {
      it('should return technician record by id', async () => {
        mockDataSources.technicianRecord.findTechnicianRecordById.mockResolvedValue(mockBenjaminHallRecord);

        const result = await getTechnicianRecordByIdResolver({}, { id: mockBenjaminHallRecordId });

        expect(mockDataSources.technicianRecord.findTechnicianRecordById).toHaveBeenCalled();
        expect(result).toEqual(mockBenjaminHallRecord);
      });
    });

    describe('getAvailableTechniciansForAssignment', () => {
      it('should return available technicians for repair job assignment sorted by name in asc order', async () => {
        mockDataSources.technicianRecord.getAvailableTechniciansForAssignment.mockResolvedValue([
          mockOliviaLewisRecord,
          mockBenjaminHallRecord,
          mockJamesAndersonRecord,
        ]);

        const result = await getAvailableTechniciansForAssignmentResolver();

        expect(mockDataSources.technicianRecord.getAvailableTechniciansForAssignment).toHaveBeenCalled();
        expect(result).toEqual([mockBenjaminHallRecord, mockJamesAndersonRecord, mockOliviaLewisRecord]);
      });
    });
  });

  describe('UserService', () => {
    let mockDataSources: ReturnType<typeof createDataSourcesMock>;

    let userResolver: TestResolver<typeof Query, 'getUser'>;

    beforeEach(() => {
      mockDataSources = createDataSourcesMock(userServicePrismaMock, userServiceSupabaseMock);

      userResolver = getResolverToTest(Query, 'getUser', mockDataSources);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return a user by id', async () => {
      const mockUserId = 'test-user-id-1';

      mockDataSources.user.user.mockResolvedValue(mockUser);

      const result = await userResolver({}, { id: mockUserId });

      expect(mockDataSources.user.user).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });
});
