import { CreateUserInput, SignInUserInput } from '@/graphql/types/server/generated_types';
import { mockElevatorRecord } from '@/mocks/elevatorManagementMocks';
import getResolverToTest, { TestResolver } from '@/mocks/gql/getResolverToTest';
import createDataSourcesMock from '@/mocks/gql/mockedDataSources';
import { repairJobServicePrismaMock } from '@/mocks/gql/prismaMocks';
import { userServiceSupabaseMock } from '@/mocks/gql/supabaseMocks';
import { mockUpcomingNotification, mockUpcomingNotificationId } from '@/mocks/notificationMocks';
import {
  mockCalendarEvent,
  mockCalendarEventId,
  mockNewCalendarInput,
  mockNewRepairJobInput,
} from '@/mocks/repairJobScheduling';
import { mockElevatorId, mockRepairJob, mockRepairJobId, mockTechnicianId } from '@/mocks/repairJobTrackingMocks';
import { mockBenjaminHallRecord, mockOliviaLewisRecord } from '@/mocks/technicianManagementMocks';
import { createMockFile, mockSupabaseUser, mockUser } from '@/mocks/userMocks';
import Mutation from '@/pages/api/graphql/resolvers/Mutation';
import { getElevatorStatusErrorMessage } from '@/pages/api/graphql/utils/utils';

jest.mock('@/pages/api/graphql/utils/utils', () => ({
  ...jest.requireActual('@/pages/api/graphql/utils/utils'),
  getElevatorStatusErrorMessage: jest.fn(),
}));

jest.mock('@/lib/supabase-service-role', () => ({
  supabaseServiceRole: {
    auth: {
      admin: {
        deleteUser: jest.fn().mockResolvedValue({ error: null }),
      },
    },
  },
}));

describe('Mutation', () => {
  let mockDataSources: ReturnType<typeof createDataSourcesMock>;

  let createRepairJobAndEventResolver: TestResolver<typeof Mutation, 'createRepairJobAndEvent'>;
  let deleteRepairJobAndEventResolver: TestResolver<typeof Mutation, 'deleteRepairJobAndEvent'>;
  let updateRepairJobResolver: TestResolver<typeof Mutation, 'updateRepairJob'>;
  let reassignTechnicianResolver: TestResolver<typeof Mutation, 'reassignTechnician'>;
  let updateElevatorRecordResolver: TestResolver<typeof Mutation, 'updateElevatorRecord'>;
  let deleteElevatorRecordResolver: TestResolver<typeof Mutation, 'deleteElevatorRecord'>;
  let createTechnicianRecordResolver: TestResolver<typeof Mutation, 'createTechnicianRecord'>;
  let updateTechnicianRecordResolver: TestResolver<typeof Mutation, 'updateTechnicianRecord'>;
  let deleteTechnicianRecordResolver: TestResolver<typeof Mutation, 'deleteTechnicianRecord'>;
  let signUpResolver: TestResolver<typeof Mutation, 'signUp'>;
  let signInResolver: TestResolver<typeof Mutation, 'signIn'>;
  let signInWithOAuthResolver: TestResolver<typeof Mutation, 'signInWithOAuth'>;
  let signOutResolver: TestResolver<typeof Mutation, 'signOut'>;
  let forgotPasswordResolver: TestResolver<typeof Mutation, 'forgotPassword'>;
  let resetPasswordResolver: TestResolver<typeof Mutation, 'resetPassword'>;
  let uploadProfilePictureResolver: TestResolver<typeof Mutation, 'uploadProfilePicture'>;
  let updateUserProfileResolver: TestResolver<typeof Mutation, 'updateUserProfile'>;
  let removeAccountResolver: TestResolver<typeof Mutation, 'removeAccount'>;
  let markNotificationAsReadResolver: TestResolver<typeof Mutation, 'markNotificationAsRead'>;
  let markAllNotificationsAsReadResolver: TestResolver<typeof Mutation, 'markAllNotificationsAsRead'>;

  beforeEach(() => {
    mockDataSources = createDataSourcesMock(repairJobServicePrismaMock, userServiceSupabaseMock);

    createRepairJobAndEventResolver = getResolverToTest(Mutation, 'createRepairJobAndEvent', mockDataSources);
    deleteRepairJobAndEventResolver = getResolverToTest(Mutation, 'deleteRepairJobAndEvent', mockDataSources);
    updateRepairJobResolver = getResolverToTest(Mutation, 'updateRepairJob', mockDataSources);
    reassignTechnicianResolver = getResolverToTest(Mutation, 'reassignTechnician', mockDataSources);
    updateElevatorRecordResolver = getResolverToTest(Mutation, 'updateElevatorRecord', mockDataSources);
    deleteElevatorRecordResolver = getResolverToTest(Mutation, 'deleteElevatorRecord', mockDataSources);
    createTechnicianRecordResolver = getResolverToTest(Mutation, 'createTechnicianRecord', mockDataSources);
    updateTechnicianRecordResolver = getResolverToTest(Mutation, 'updateTechnicianRecord', mockDataSources);
    deleteTechnicianRecordResolver = getResolverToTest(Mutation, 'deleteTechnicianRecord', mockDataSources);
    signUpResolver = getResolverToTest(Mutation, 'signUp', mockDataSources);
    signInResolver = getResolverToTest(Mutation, 'signIn', mockDataSources);
    signInWithOAuthResolver = getResolverToTest(Mutation, 'signInWithOAuth', mockDataSources);
    signOutResolver = getResolverToTest(Mutation, 'signOut', mockDataSources);
    forgotPasswordResolver = getResolverToTest(Mutation, 'forgotPassword', mockDataSources);
    resetPasswordResolver = getResolverToTest(Mutation, 'resetPassword', mockDataSources);
    uploadProfilePictureResolver = getResolverToTest(Mutation, 'uploadProfilePicture', mockDataSources);
    updateUserProfileResolver = getResolverToTest(Mutation, 'updateUserProfile', mockDataSources);
    removeAccountResolver = getResolverToTest(Mutation, 'removeAccount', mockDataSources);
    markNotificationAsReadResolver = getResolverToTest(Mutation, 'markNotificationAsRead', mockDataSources);
    markAllNotificationsAsReadResolver = getResolverToTest(Mutation, 'markAllNotificationsAsRead', mockDataSources);

    (getElevatorStatusErrorMessage as jest.Mock).mockReturnValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createRepairJobAndEvent', () => {
    beforeEach(() => {
      mockDataSources.elevatorRecord.findElevatorRecordByRepairJob.mockResolvedValue({
        ...mockElevatorRecord,
        id: mockElevatorId,
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully create a repair job and event', async () => {
      mockDataSources.repairJob.createRepairJob.mockResolvedValue(mockRepairJob);
      mockDataSources.repairJob.updateRepairJobWithCalendarEventId.mockResolvedValue(mockRepairJob);
      mockDataSources.calendarEvent.createCalendarEvent.mockResolvedValue(mockCalendarEvent);
      mockDataSources.technicianRecord.validateTechnicianAssignment.mockResolvedValue(mockBenjaminHallRecord);
      mockDataSources.elevatorRecord.findElevatorRecordByRepairJob.mockResolvedValue({
        ...mockElevatorRecord,
        id: mockElevatorId,
      });

      const result = await createRepairJobAndEventResolver(
        {},
        { repairJobInput: mockNewRepairJobInput, calendarEventInput: mockNewCalendarInput }
      );

      expect(mockDataSources.repairJob.createRepairJob).toHaveBeenCalledWith(
        mockNewRepairJobInput,
        mockElevatorId,
        mockTechnicianId
      );
      expect(mockDataSources.calendarEvent.createCalendarEvent).toHaveBeenCalledWith(
        mockNewCalendarInput,
        mockRepairJobId
      );
      expect(result).toEqual({
        calendarEvent: mockCalendarEvent,
        repairJob: mockRepairJob,
      });
    });

    it('should update repair job with calendar event ID after event is created', async () => {
      mockDataSources.repairJob.createRepairJob.mockResolvedValue(mockRepairJob);
      mockDataSources.calendarEvent.createCalendarEvent.mockResolvedValue(mockCalendarEvent);
      mockDataSources.repairJob.updateRepairJobWithCalendarEventId.mockResolvedValue(mockRepairJob);
      mockDataSources.technicianRecord.validateTechnicianAssignment.mockResolvedValue(mockBenjaminHallRecord);

      await createRepairJobAndEventResolver(
        {},
        { repairJobInput: mockNewRepairJobInput, calendarEventInput: mockNewCalendarInput }
      );

      expect(mockDataSources.repairJob.updateRepairJobWithCalendarEventId).toHaveBeenCalledWith(
        mockRepairJobId,
        mockCalendarEvent.id
      );
    });

    it('should throw an error if failed to create a new repair job', async () => {
      const mockError = new Error('Failed to create repair job');

      mockDataSources.repairJob.createRepairJob.mockRejectedValue(mockError);

      await expect(
        createRepairJobAndEventResolver(
          {},
          { repairJobInput: mockNewRepairJobInput, calendarEventInput: mockNewCalendarInput }
        )
      ).rejects.toThrow('Failed to create repair job');

      expect(mockDataSources.repairJob.createRepairJob).toHaveBeenCalled();
      expect(mockDataSources.calendarEvent.createCalendarEvent).not.toHaveBeenCalled();
    });

    it('should throw and error if failed to create a calendar event', async () => {
      const mockError = new Error('Calendar event failed to create');

      mockDataSources.repairJob.createRepairJob.mockResolvedValue(mockRepairJob);
      mockDataSources.calendarEvent.createCalendarEvent.mockRejectedValue(mockError);

      await expect(
        createRepairJobAndEventResolver(
          {},
          { repairJobInput: mockNewRepairJobInput, calendarEventInput: mockNewCalendarInput }
        )
      ).rejects.toThrow(mockError);

      expect(mockDataSources.repairJob.createRepairJob).toHaveBeenCalled();
      expect(mockDataSources.calendarEvent.createCalendarEvent).toHaveBeenCalled();
    });

    it('should update repair job with calendar event ID after event is created', async () => {
      mockDataSources.repairJob.createRepairJob.mockResolvedValue(mockRepairJob);
      mockDataSources.calendarEvent.createCalendarEvent.mockResolvedValue(mockCalendarEvent);
      mockDataSources.repairJob.updateRepairJobWithCalendarEventId.mockResolvedValue(mockRepairJob);
      mockDataSources.technicianRecord.validateTechnicianAssignment.mockResolvedValue(mockBenjaminHallRecord);

      await createRepairJobAndEventResolver(
        {},
        { repairJobInput: mockNewRepairJobInput, calendarEventInput: mockNewCalendarInput }
      );

      expect(mockDataSources.repairJob.updateRepairJobWithCalendarEventId).toHaveBeenCalledWith(
        mockRepairJobId,
        mockCalendarEvent.id
      );
    });

    it('should validate technician assignment if technicianId is present', async () => {
      mockDataSources.repairJob.createRepairJob.mockResolvedValue({
        ...mockRepairJob,
        technicianName: 'Benjamin Hall',
      });
      mockDataSources.calendarEvent.createCalendarEvent.mockResolvedValue(mockCalendarEvent);
      mockDataSources.repairJob.updateRepairJobWithCalendarEventId.mockResolvedValue({
        ...mockRepairJob,
        technicianName: 'Benjamin Hall',
      });
      mockDataSources.technicianRecord.validateTechnicianAssignment.mockResolvedValue(mockBenjaminHallRecord);

      const result = await createRepairJobAndEventResolver(
        {},
        {
          repairJobInput: {
            ...mockNewRepairJobInput,
            technicianName: 'Benjamin Hall',
            technicianId: mockBenjaminHallRecord.id,
          },
          calendarEventInput: mockNewCalendarInput,
        }
      );

      expect(mockDataSources.technicianRecord.validateTechnicianAssignment).toHaveBeenCalledWith(
        mockBenjaminHallRecord.id,
        'Benjamin Hall'
      );
      expect(result).toEqual({
        calendarEvent: mockCalendarEvent,
        repairJob: { ...mockRepairJob, technicianName: 'Benjamin Hall' },
      });
    });

    it('should throw if technician validation fails', async () => {
      mockDataSources.repairJob.createRepairJob.mockResolvedValue({
        ...mockRepairJob,
        technicianName: 'Max Smith',
      });
      mockDataSources.calendarEvent.createCalendarEvent.mockResolvedValue(mockCalendarEvent);
      mockDataSources.repairJob.updateRepairJobWithCalendarEventId.mockResolvedValue({
        ...mockRepairJob,
        technicianName: 'Max Smith',
      });
      mockDataSources.technicianRecord.validateTechnicianAssignment.mockRejectedValue(new Error('Invalid technician'));

      await expect(
        createRepairJobAndEventResolver(
          {},
          {
            repairJobInput: { ...mockNewRepairJobInput, technicianName: 'Max Smith' },
            calendarEventInput: mockNewCalendarInput,
          }
        )
      ).rejects.toThrow('Invalid technician');
    });

    it('should throw an error if elevator status has a corresponding error message', async () => {
      const mockExpectedErrorMessage = 'Elevator is out of service';

      mockDataSources.elevatorRecord.findElevatorRecordByRepairJob.mockResolvedValue({
        ...mockElevatorRecord,
        status: 'Out Of Service',
      });

      (getElevatorStatusErrorMessage as jest.Mock).mockReturnValue({
        'Out Of Service': mockExpectedErrorMessage,
      });

      await expect(
        createRepairJobAndEventResolver(
          {},
          { repairJobInput: mockNewRepairJobInput, calendarEventInput: mockNewCalendarInput }
        )
      ).rejects.toThrow(mockExpectedErrorMessage);

      expect(mockDataSources.repairJob.createRepairJob).not.toHaveBeenCalled();
      expect(mockDataSources.calendarEvent.createCalendarEvent).not.toHaveBeenCalled();
    });
  });

  describe('deleteRepairJobAndEvent', () => {
    it('should successfully delete repair job and calendar event, and update technician and elevator statuses', async () => {
      mockDataSources.repairJob.findRepairJobById.mockResolvedValue(mockRepairJob);
      mockDataSources.calendarEvent.deleteCalendarEvent.mockResolvedValue(mockCalendarEvent);
      mockDataSources.repairJob.deleteRepairJob.mockResolvedValue(mockRepairJob);
      mockDataSources.elevatorRecord.findElevatorRecordById.mockResolvedValue(mockElevatorRecord);
      mockDataSources.technicianRecord.findTechnicianRecordById.mockResolvedValue(mockBenjaminHallRecord);
      mockDataSources.elevatorRecord.updateElevatorStatus.mockResolvedValue({
        ...mockElevatorRecord,
        id: mockElevatorId,
        status: 'Operational',
      });

      const result = await deleteRepairJobAndEventResolver(
        {},
        {
          calendarEventId: mockCalendarEventId,
          repairJobId: mockRepairJobId,
        }
      );

      expect(mockDataSources.repairJob.findRepairJobById).toHaveBeenCalledWith(mockRepairJobId);
      expect(mockDataSources.calendarEvent.deleteCalendarEvent).toHaveBeenCalledWith(mockCalendarEventId);
      expect(mockDataSources.repairJob.deleteRepairJob).toHaveBeenCalledWith(mockRepairJobId);
      expect(mockDataSources.elevatorRecord.findElevatorRecordById).toHaveBeenCalledWith(mockElevatorId);
      expect(mockDataSources.technicianRecord.findTechnicianRecordById).toHaveBeenCalledWith(
        mockRepairJob.technicianId
      );
      expect(mockDataSources.technicianRecord.updateTechnicianStatus).toHaveBeenCalledWith(
        mockBenjaminHallRecord.id,
        'Available'
      );
      expect(mockDataSources.elevatorRecord.updateElevatorStatus).toHaveBeenCalledWith(
        mockElevatorRecord.id,
        'Operational'
      );
      expect(result).toEqual({
        deletedEventId: mockCalendarEventId,
        deletedRepairJobId: mockRepairJobId,
      });
    });
  });

  describe('updateRepairJob', () => {
    it('should correctly update repair job, technician status, elevator status, and maintenance dates', async () => {
      const updatedStatus = 'In Progress';
      const mockUpdatedRepairJob = {
        ...mockRepairJob,
        status: updatedStatus,
        technicianName: mockBenjaminHallRecord.name,
      };

      mockDataSources.repairJob.updateRepairJob.mockResolvedValue(mockUpdatedRepairJob);
      mockDataSources.technicianRecord.findTechnicianRecordById.mockResolvedValue(mockBenjaminHallRecord);
      mockDataSources.technicianRecord.updateTechnicianStatus.mockResolvedValue();
      mockDataSources.elevatorRecord.findElevatorRecordById.mockResolvedValue(mockElevatorRecord);
      mockDataSources.elevatorRecord.updateElevatorStatus.mockResolvedValue({
        ...mockElevatorRecord,
        id: mockElevatorId,
        status: 'Under Maintenance',
      });
      mockDataSources.elevatorRecord.updateElevatorMaintenanceDates.mockResolvedValue();

      const result = await updateRepairJobResolver({}, { input: mockUpdatedRepairJob });

      expect(mockDataSources.repairJob.updateRepairJob).toHaveBeenCalledWith(mockUpdatedRepairJob);
      expect(mockDataSources.technicianRecord.findTechnicianRecordById).toHaveBeenCalledWith(
        mockUpdatedRepairJob.technicianId
      );
      expect(mockDataSources.technicianRecord.updateTechnicianStatus).toHaveBeenCalledWith(
        mockBenjaminHallRecord.id,
        'Busy'
      );
      expect(mockDataSources.elevatorRecord.findElevatorRecordById).toHaveBeenCalledWith(mockElevatorId);
      expect(mockDataSources.elevatorRecord.updateElevatorStatus).toHaveBeenCalledWith(
        mockElevatorRecord.id,
        'Under Maintenance'
      );
      expect(mockDataSources.elevatorRecord.updateElevatorMaintenanceDates).toHaveBeenCalledWith(
        mockElevatorRecord.id,
        'Scenic Elevator'
      );
      expect(result).toEqual(mockUpdatedRepairJob);
    });
  });

  describe('reassignTechnician', () => {
    it('should throw an error if repair job not found', async () => {
      const mockInput = {
        id: mockRepairJobId,
        technicianName: mockBenjaminHallRecord.name,
      };

      mockDataSources.repairJob.findRepairJobById.mockResolvedValue(null);

      await expect(reassignTechnicianResolver({}, { input: mockInput })).rejects.toThrow(
        `Repair job with ID ${mockRepairJobId} not found.`
      );

      expect(mockDataSources.repairJob.findRepairJobById).toHaveBeenCalledWith(mockRepairJobId);
    });

    it('should throw an error if new technician is same as current', async () => {
      const mockTechnicianId = 'test-technician-id-1';
      const mockInput = {
        id: mockRepairJobId,
        technicianId: mockTechnicianId,
        technicianName: 'Sophia Martinez',
      };

      mockDataSources.repairJob.findRepairJobById.mockResolvedValue({
        ...mockRepairJob,
        technicianId: mockTechnicianId,
      });

      await expect(reassignTechnicianResolver({}, { input: mockInput })).rejects.toThrow(
        'Technician Sophia Martinez is already assigned to this repair job.'
      );

      expect(mockDataSources.repairJob.findRepairJobById).toHaveBeenCalledWith(mockRepairJobId);
    });

    it('should unassign current technician and assign new technician', async () => {
      const mockNewTechnicianId = mockOliviaLewisRecord.id;

      mockDataSources.repairJob.findRepairJobById.mockResolvedValue({
        ...mockRepairJob,
        technicianId: mockBenjaminHallRecord.id,
      });

      mockDataSources.technicianRecord.findTechnicianRecordById.mockImplementation(async (id) => {
        if (id === mockBenjaminHallRecord.id) return mockBenjaminHallRecord;
        if (id === mockOliviaLewisRecord.id) return mockOliviaLewisRecord;
        return null;
      });

      mockDataSources.technicianRecord.updateTechnicianStatus.mockResolvedValue();
      mockDataSources.repairJob.updateRepairJob.mockResolvedValue({
        ...mockRepairJob,
        technicianId: mockOliviaLewisRecord.id,
        technicianName: mockOliviaLewisRecord.name,
      });

      const result = await reassignTechnicianResolver(
        {},
        { input: { id: mockRepairJobId, technicianId: mockNewTechnicianId } }
      );

      expect(mockDataSources.repairJob.findRepairJobById).toHaveBeenCalledWith(mockRepairJobId);

      // Unassign previous tech
      expect(mockDataSources.technicianRecord.updateTechnicianStatus).toHaveBeenCalledWith(
        mockBenjaminHallRecord.id,
        'Available'
      );

      // Assign new tech
      expect(mockDataSources.technicianRecord.updateTechnicianStatus).toHaveBeenCalledWith(
        mockOliviaLewisRecord.id,
        'Busy'
      );

      // Update job
      expect(mockDataSources.repairJob.updateRepairJob).toHaveBeenCalledWith({
        id: mockRepairJobId,
        technicianId: mockOliviaLewisRecord.id,
        technicianName: mockOliviaLewisRecord.name,
      });

      expect(result).toEqual({
        ...mockRepairJob,
        technicianId: mockOliviaLewisRecord.id,
        technicianName: mockOliviaLewisRecord.name,
      });
    });

    it('should throw and error if new technician not found', async () => {
      const mockNewTechId = 'non-existent-id';
      const mockNewTechnician = 'Pedro Gomez';

      mockDataSources.repairJob.findRepairJobById.mockResolvedValue(mockRepairJob);

      mockDataSources.technicianRecord.findTechnicianRecordById.mockResolvedValue(null);

      await expect(
        reassignTechnicianResolver(
          {},
          { input: { id: mockRepairJobId, technicianId: mockNewTechId, technicianName: mockNewTechnician } }
        )
      ).rejects.toThrow(`Technician ${mockNewTechnician} not found.`);

      expect(mockDataSources.technicianRecord.findTechnicianRecordById).toHaveBeenCalledWith(mockNewTechId);
    });
  });

  describe('updateElevatorRecord', () => {
    const mockError = 'Failed to update elevator record';
    const mockInput = {
      id: mockElevatorRecord.id,
      status: 'Out of Service',
      lastKnownStatus: 'Operational',
    };
    const mockUpdatedElevatorRecord = {
      ...mockElevatorRecord,
      status: 'Out of Service',
      lastKnownStatus: 'Operational',
    };

    it('should update elevator record', async () => {
      mockDataSources.elevatorRecord.updateElevatorRecord.mockResolvedValue(mockUpdatedElevatorRecord);

      const result = await updateElevatorRecordResolver({}, { input: mockInput });

      expect(mockDataSources.elevatorRecord.updateElevatorRecord).toHaveBeenCalledWith(mockInput);
      expect(result).toEqual(mockUpdatedElevatorRecord);
    });

    it('should throw an error when failed to update elevator record', async () => {
      mockDataSources.elevatorRecord.updateElevatorRecord.mockRejectedValueOnce(new Error(mockError));

      await expect(updateElevatorRecordResolver({}, { input: mockInput })).rejects.toThrow(mockError);
    });
  });

  describe('deleteElevatorRecord', () => {
    const mockError = 'Failed to delete elevator record';

    it('should delete elevator record', async () => {
      mockDataSources.elevatorRecord.deleteElevatorRecord.mockResolvedValue(mockElevatorRecord);

      const result = await deleteElevatorRecordResolver({}, { id: mockElevatorRecord.id });

      expect(mockDataSources.elevatorRecord.deleteElevatorRecord).toHaveBeenCalledWith(mockElevatorRecord.id);
      expect(result).toEqual({ id: mockElevatorRecord.id });
    });

    it('should throw an error when failed to delete elevator record', async () => {
      mockDataSources.elevatorRecord.deleteElevatorRecord.mockRejectedValueOnce(new Error(mockError));

      await expect(deleteElevatorRecordResolver({}, { id: mockElevatorRecord.id })).rejects.toThrow(mockError);
    });
  });

  describe('createTechnicianRecord', () => {
    const mockError = 'Failed to create technician record';
    const mockInput = {
      availabilityStatus: mockBenjaminHallRecord.availabilityStatus,
      certifications: mockBenjaminHallRecord.certifications,
      contactInformation: mockBenjaminHallRecord.contactInformation,
      employmentStatus: mockBenjaminHallRecord.employmentStatus,
      name: mockBenjaminHallRecord.name,
      skills: mockBenjaminHallRecord.skills,
    };

    it('should create technician record', async () => {
      mockDataSources.technicianRecord.createTechnicianRecord.mockResolvedValue(mockBenjaminHallRecord);

      const result = await createTechnicianRecordResolver({}, { input: mockInput });

      expect(mockDataSources.technicianRecord.createTechnicianRecord).toHaveBeenCalledWith(mockInput);
      expect(result).toEqual(mockBenjaminHallRecord);
    });

    it('should throw an error when failed to create technician record', async () => {
      mockDataSources.technicianRecord.createTechnicianRecord.mockRejectedValueOnce(new Error(mockError));

      await expect(createTechnicianRecordResolver({}, { input: mockInput })).rejects.toThrow(mockError);
    });
  });

  describe('updateTechnicianRecord', () => {
    const mockError = 'Failed to update technician record';
    const mockInput = {
      id: mockBenjaminHallRecord.id,
      skills: ['New Test Skill'],
    };
    const mockUpdatedTechnicianRecord = {
      ...mockBenjaminHallRecord,
      skills: ['New Test Skill'],
    };

    it('should update elevator record', async () => {
      mockDataSources.technicianRecord.updateTechnicianRecord.mockResolvedValue(mockUpdatedTechnicianRecord);

      const result = await updateTechnicianRecordResolver({}, { input: mockInput });

      expect(mockDataSources.technicianRecord.updateTechnicianRecord).toHaveBeenCalledWith(mockInput);
      expect(result).toEqual(mockUpdatedTechnicianRecord);
    });

    it('should throw an error when failed to update technician record', async () => {
      mockDataSources.technicianRecord.updateTechnicianRecord.mockRejectedValueOnce(new Error(mockError));

      await expect(updateTechnicianRecordResolver({}, { input: mockInput })).rejects.toThrow(mockError);
    });
  });

  describe('deleteTechnicianRecord', () => {
    const mockError = 'Failed to delete technician record';

    it('should delete technician record', async () => {
      mockDataSources.technicianRecord.deleteTechnicianRecord.mockResolvedValue(mockBenjaminHallRecord);

      const result = await deleteTechnicianRecordResolver({}, { id: mockBenjaminHallRecord.id });

      expect(mockDataSources.technicianRecord.deleteTechnicianRecord).toHaveBeenCalledWith(mockBenjaminHallRecord.id);
      expect(result).toEqual({ id: mockBenjaminHallRecord.id });
    });

    it('should throw an error when failed to delete technician record', async () => {
      mockDataSources.technicianRecord.deleteTechnicianRecord.mockRejectedValueOnce(new Error(mockError));

      await expect(deleteTechnicianRecordResolver({}, { id: mockBenjaminHallRecord.id })).rejects.toThrow(mockError);
    });
  });

  describe('signUp', () => {
    const mockError = 'Failed to signUp';
    const mockInput: CreateUserInput = {
      email: 'test@gmail.com',
      password: 'test-password',
      firstName: 'Mike',
      lastName: 'Arrow',
      emailRedirectTo: 'http://localhost/welcome-new-user',
    };

    it('should create a new user', async () => {
      mockDataSources.auth.signUp.mockResolvedValue(mockSupabaseUser);

      const result = await signUpResolver({}, { input: mockInput });

      expect(mockDataSources.auth.signUp).toHaveBeenCalledWith(mockInput);
      expect(result).toEqual({ id: mockSupabaseUser.id });
    });

    it('should throw an error when sign up fails', async () => {
      mockDataSources.auth.signUp.mockRejectedValueOnce(new Error(mockError));

      await expect(signUpResolver({}, { input: mockInput })).rejects.toThrow(mockError);
    });
  });

  describe('signIn', () => {
    const mockError = 'Failed to signIn';
    const mockInput: SignInUserInput = {
      email: 'test@gmail.com',
      password: 'test-password',
    };

    it('should sign-in an existing user', async () => {
      mockDataSources.auth.signIn.mockResolvedValue(mockSupabaseUser);

      const result = await signInResolver({}, { input: mockInput });

      expect(mockDataSources.auth.signIn).toHaveBeenCalledWith(mockInput);
      expect(result).toEqual({ id: mockSupabaseUser.id });
    });

    it('should throw an error when sign in fails', async () => {
      mockDataSources.auth.signIn.mockRejectedValueOnce(new Error(mockError));

      await expect(signInResolver({}, { input: mockInput })).rejects.toThrow(mockError);
    });
  });

  describe('signInWithOAuth', () => {
    const mockError = 'Failed to signInWithOAuth';

    it('should sign in with Google Oauth provider', async () => {
      const mockOauthUrl = 'https://test-google-url.com';

      mockDataSources.auth.signInWithOAuth.mockResolvedValue(mockOauthUrl);

      const result = await signInWithOAuthResolver({}, { input: { provider: 'GOOGLE' } });

      expect(mockDataSources.auth.signInWithOAuth).toHaveBeenCalledWith('GOOGLE');
      expect(result).toEqual(mockOauthUrl);
    });

    it('should sign in with Github Oauth provider', async () => {
      const mockOauthUrl = 'https://test-github-url.com';

      mockDataSources.auth.signInWithOAuth.mockResolvedValue(mockOauthUrl);

      const result = await signInWithOAuthResolver({}, { input: { provider: 'GITHUB' } });

      expect(mockDataSources.auth.signInWithOAuth).toHaveBeenCalledWith('GITHUB');
      expect(result).toEqual(mockOauthUrl);
    });

    it('should throw an error when sign in user with OAuth fails', async () => {
      mockDataSources.auth.signInWithOAuth.mockRejectedValueOnce(new Error(mockError));

      await expect(signInWithOAuthResolver({}, { input: { provider: 'GITHUB' } })).rejects.toThrow(mockError);
    });
  });

  describe('signOut', () => {
    const mockError = 'Failed to signOut';

    it('should signOut an existing user', async () => {
      mockDataSources.auth.signOut.mockResolvedValue(true);

      const result = await signOutResolver();

      expect(result).toEqual(true);
    });

    it('should throw an error when user signOut fails', async () => {
      mockDataSources.auth.signOut.mockRejectedValueOnce(new Error(mockError));

      await expect(signOutResolver()).rejects.toThrow(mockError);
    });
  });

  describe('forgotPassword', () => {
    const mockError = 'Failed to forgot password';
    const mockEmail = 'test@gmail.com';
    const mockRedirectToUrl = 'https://test-redirect-url.com';

    const mockInput = {
      email: mockEmail,
      redirectTo: mockRedirectToUrl,
    };

    it("should successfully reset user's forgotten password", async () => {
      mockDataSources.auth.forgotPassword.mockResolvedValue(true);

      const result = await forgotPasswordResolver({}, { input: mockInput });

      expect(mockDataSources.auth.forgotPassword).toHaveBeenCalledWith(mockEmail, mockRedirectToUrl);
      expect(result).toEqual(true);
    });

    it('should throw an error when forgot password fails', async () => {
      mockDataSources.auth.forgotPassword.mockRejectedValueOnce(new Error(mockError));

      await expect(forgotPasswordResolver({}, { input: mockInput })).rejects.toThrow(mockError);
    });
  });

  describe('resetPassword', () => {
    const mockError = 'Failed to reset password';
    const mockPassword = 'new-test-password';

    it("should successfully update the user's password after it was reset", async () => {
      mockDataSources.auth.resetPassword.mockResolvedValue(mockSupabaseUser);

      const result = await resetPasswordResolver({}, { input: { password: mockPassword } });

      expect(mockDataSources.auth.resetPassword).toHaveBeenCalledWith(mockPassword);
      expect(result).toEqual(mockSupabaseUser);
    });

    it('should throw an error when reset password fails', async () => {
      mockDataSources.auth.resetPassword.mockRejectedValueOnce(new Error(mockError));

      await expect(resetPasswordResolver({}, { input: { password: mockPassword } })).rejects.toThrow(mockError);
    });
  });

  describe('uploadProfilePicture', () => {
    const mockError = 'Failed to upload profile picture';
    const mockFile = createMockFile();

    it("should upload user's profile picture", async () => {
      mockDataSources.user.uploadProfilePicture.mockResolvedValue(mockUser);

      const result = await uploadProfilePictureResolver({}, { file: mockFile });

      expect(mockDataSources.user.uploadProfilePicture).toHaveBeenCalledWith(mockFile);
      expect(result).toEqual(mockUser);
    });

    it('should throw an error when upload of profile picture fails', async () => {
      mockDataSources.user.uploadProfilePicture.mockRejectedValueOnce(new Error(mockError));

      await expect(uploadProfilePictureResolver({}, { file: mockFile })).rejects.toThrow(mockError);
    });
  });

  describe('updateUserProfile', () => {
    const mockError = 'Failed to update user profile';
    const mockNewPhoneNumber = '+380666188618';
    const mockInput = {
      phone: mockNewPhoneNumber,
    };
    const mockUpdatedUser = {
      ...mockUser,
      phone: mockNewPhoneNumber,
    };

    it('should update user profile', async () => {
      mockDataSources.user.updateUserProfile.mockResolvedValue(mockUpdatedUser);

      const result = await updateUserProfileResolver({}, { input: mockInput });

      expect(mockDataSources.user.updateUserProfile).toHaveBeenCalledWith({ phone: mockNewPhoneNumber });
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should throw an error when update of user profile fails', async () => {
      mockDataSources.user.updateUserProfile.mockRejectedValueOnce(new Error(mockError));

      await expect(updateUserProfileResolver({}, { input: mockInput })).rejects.toThrow(mockError);
    });
  });

  describe('removeAccount', () => {
    const mockUserId = 'test-user-id-2';

    it('should remove user account', async () => {
      const result = await removeAccountResolver({}, { userId: mockUserId });

      expect(mockDataSources.user.removeAccount).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual({ userId: mockUserId });
    });

    it('should throw an error if removeAccount fails', async () => {
      const mockError = 'Failed to remove account';

      mockDataSources.user.removeAccount.mockRejectedValueOnce(new Error(mockError));

      await expect(removeAccountResolver({}, { userId: mockUserId })).rejects.toThrow(mockError);
    });
  });

  describe('markNotificationAsRead', () => {
    it('should mark specific notification as read', async () => {
      const mockResponse = {
        ...mockUpcomingNotification,
        id: mockUpcomingNotificationId,
        status: 'Read',
        readAt: new Date(),
        createdAt: new Date(mockUpcomingNotification.createdAt),
      };

      mockDataSources.notification.markAsRead.mockResolvedValueOnce(mockResponse);

      const result = await markNotificationAsReadResolver({}, { input: { id: mockUpcomingNotificationId } });

      expect(mockDataSources.notification.markAsRead).toHaveBeenCalledWith(mockUpcomingNotificationId);
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if markNotificationAsRead fails', async () => {
      const mockError = 'Failed to remove account';

      mockDataSources.notification.markAsRead.mockRejectedValueOnce(new Error(mockError));

      await expect(markNotificationAsReadResolver({}, { input: { id: mockUpcomingNotificationId } })).rejects.toThrow(
        mockError
      );
    });
  });

  describe('markAllNotificationsAsRead', () => {
    it('should mark all notifications as read', async () => {
      const mockIds = ['id-1', 'id-2'];

      mockDataSources.notification.markAllAsRead.mockResolvedValueOnce({
        updatedNotificationIds: mockIds,
      });

      const result = await markAllNotificationsAsReadResolver();

      expect(mockDataSources.notification.markAllAsRead).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ updatedNotificationIds: mockIds });
    });

    it('should throw an error if markAllNotificationsAsRead fails', async () => {
      const mockError = 'Failed to mark all as read';

      mockDataSources.notification.markAllAsRead.mockRejectedValueOnce(new Error(mockError));

      await expect(markAllNotificationsAsReadResolver()).rejects.toThrow(mockError);
    });
  });
});
