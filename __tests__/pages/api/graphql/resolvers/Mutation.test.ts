import { CreateUserInput, SignInUserInput } from '@/graphql/types/server/generated_types';
import { mockElevatorRecord } from '@/mocks/elevatorManagementMocks';
import getResolverToTest, { TestResolver } from '@/mocks/gql/getResolverToTest';
import createDataSourcesMock from '@/mocks/gql/mockedDataSources';
import { repairJobServicePrismaMock } from '@/mocks/gql/prismaMocks';
import { userServiceSupabaseMock } from '@/mocks/gql/supabaseMocks';
import {
  mockCalendarEvent,
  mockCalendarEventId,
  mockNewCalendarInput,
  mockNewRepairJobInput,
} from '@/mocks/repairJobScheduling';
import { mockRepairJob, mockRepairJobId } from '@/mocks/repairJobTrackingMocks';
import { mockBenjaminHallRecord, mockOliviaLewisRecord } from '@/mocks/technicianManagementMocks';
import { createMockFile, mockSupabaseUser, mockUser } from '@/mocks/userMocks';
import Mutation from '@/pages/api/graphql/resolvers/Mutation';
import { getElevatorStatusErrorMessage } from '@/pages/api/graphql/utils';

jest.mock('@/pages/api/graphql/utils', () => ({
  ...jest.requireActual('@/pages/api/graphql/utils'),
  getElevatorStatusErrorMessage: jest.fn(),
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

    (getElevatorStatusErrorMessage as jest.Mock).mockReturnValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createRepairJobAndEvent', () => {
    it('should successfully create a repair job and event', async () => {
      mockDataSources.repairJob.createRepairJob.mockResolvedValue(mockRepairJob);
      mockDataSources.repairJob.updateRepairJobWithCalendarEventId.mockResolvedValue(mockRepairJob);
      mockDataSources.calendarEvent.createCalendarEvent.mockResolvedValue(mockCalendarEvent);
      mockDataSources.technicianRecord.validateTechnicianAssignment.mockResolvedValue(mockBenjaminHallRecord);

      const result = await createRepairJobAndEventResolver(
        {},
        { repairJobInput: mockNewRepairJobInput, calendarEventInput: mockNewCalendarInput }
      );

      expect(mockDataSources.repairJob.createRepairJob).toHaveBeenCalledWith(mockNewRepairJobInput);
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
          repairJobInput: { ...mockNewRepairJobInput, technicianName: 'Benjamin Hall' },
          calendarEventInput: mockNewCalendarInput,
        }
      );

      expect(mockDataSources.technicianRecord.validateTechnicianAssignment).toHaveBeenCalledWith('Benjamin Hall');
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
      mockDataSources.elevatorRecord.findElevatorRecordByRepairJob.mockResolvedValue(mockElevatorRecord);
      mockDataSources.technicianRecord.findTechnicianRecordByName.mockResolvedValue(mockBenjaminHallRecord);
      mockDataSources.elevatorRecord.updateElevatorStatus.mockResolvedValue({
        ...mockElevatorRecord,
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
      expect(mockDataSources.elevatorRecord.findElevatorRecordByRepairJob).toHaveBeenCalledWith(mockRepairJob);
      expect(mockDataSources.technicianRecord.findTechnicianRecordByName).toHaveBeenCalledWith(
        mockRepairJob.technicianName
      );
      expect(mockDataSources.technicianRecord.updateTechnicianStatus).toHaveBeenCalledWith(
        mockBenjaminHallRecord.id,
        'Available'
      );
      expect(mockDataSources.elevatorRecord.findElevatorRecordByRepairJob).toHaveBeenCalledWith(mockRepairJob);
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
      mockDataSources.technicianRecord.findTechnicianRecordByName.mockResolvedValue(mockBenjaminHallRecord);
      mockDataSources.technicianRecord.updateTechnicianStatus.mockResolvedValue();
      mockDataSources.elevatorRecord.findElevatorRecordByRepairJob.mockResolvedValue(mockElevatorRecord);
      mockDataSources.elevatorRecord.updateElevatorStatus.mockResolvedValue({
        ...mockElevatorRecord,
        status: 'Under Maintenance',
      });
      mockDataSources.elevatorRecord.updateElevatorMaintenanceDates.mockResolvedValue();

      const result = await updateRepairJobResolver({}, { input: mockUpdatedRepairJob });

      expect(mockDataSources.repairJob.updateRepairJob).toHaveBeenCalledWith(mockUpdatedRepairJob);
      expect(mockDataSources.technicianRecord.findTechnicianRecordByName).toHaveBeenCalledWith(
        mockUpdatedRepairJob.technicianName
      );
      expect(mockDataSources.technicianRecord.updateTechnicianStatus).toHaveBeenCalledWith(
        mockBenjaminHallRecord.id,
        'Busy'
      );
      expect(mockDataSources.elevatorRecord.findElevatorRecordByRepairJob).toHaveBeenCalledWith(mockUpdatedRepairJob);
      expect(mockDataSources.elevatorRecord.updateElevatorStatus).toHaveBeenCalledWith(
        mockElevatorRecord.id,
        'Under Maintenance'
      );
      expect(mockDataSources.elevatorRecord.updateElevatorMaintenanceDates).toHaveBeenCalledWith(mockElevatorRecord.id);
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
      const mockInput = {
        id: mockRepairJobId,
        technicianName: 'Sophia Martinez',
      };

      mockDataSources.repairJob.findRepairJobById.mockResolvedValue(mockRepairJob);

      await expect(reassignTechnicianResolver({}, { input: mockInput })).rejects.toThrow(
        'Technician Sophia Martinez is already assigned to this repair job.'
      );

      expect(mockDataSources.repairJob.findRepairJobById).toHaveBeenCalledWith(mockRepairJobId);
    });

    it('should unassign current technician and assign new technician', async () => {
      const mockNewTechnicianName = 'Olivia Lewis';
      const mockedRepairJob = {
        ...mockRepairJob,
        technicianName: mockBenjaminHallRecord.name,
      };
      const mockUpdatedRepairJob = {
        ...mockRepairJob,
        technicianName: mockNewTechnicianName,
      };

      mockDataSources.repairJob.findRepairJobById.mockResolvedValue(mockedRepairJob);
      mockDataSources.technicianRecord.findTechnicianRecordByName.mockImplementation(async (name) => {
        if (name === mockBenjaminHallRecord.name) return mockBenjaminHallRecord;
        if (name === mockNewTechnicianName) return mockOliviaLewisRecord;
        return null;
      });
      mockDataSources.technicianRecord.updateTechnicianStatus.mockResolvedValue();
      mockDataSources.repairJob.updateRepairJob.mockResolvedValue(mockUpdatedRepairJob);

      const result = await reassignTechnicianResolver(
        {},
        { input: { id: mockRepairJobId, technicianName: mockNewTechnicianName } }
      );

      expect(mockDataSources.repairJob.findRepairJobById).toHaveBeenCalledWith(mockRepairJobId);

      // Unassign current technician
      expect(mockDataSources.technicianRecord.findTechnicianRecordByName).toHaveBeenCalledWith(
        mockBenjaminHallRecord.name
      );
      expect(mockDataSources.technicianRecord.updateTechnicianStatus).toHaveBeenCalledWith(
        mockBenjaminHallRecord.id,
        'Available'
      );

      // Assign new technician
      expect(mockDataSources.technicianRecord.findTechnicianRecordByName).toHaveBeenCalledWith(mockNewTechnicianName);
      expect(mockDataSources.technicianRecord.updateTechnicianStatus).toHaveBeenCalledWith(
        mockOliviaLewisRecord.id,
        'Busy'
      );

      // Update repair job with new technician
      expect(mockDataSources.repairJob.updateRepairJob).toHaveBeenCalledWith({
        ...mockRepairJob,
        technicianName: mockNewTechnicianName,
      });

      expect(result).toEqual(mockUpdatedRepairJob);
    });

    it('should throw and error if new technician not found', async () => {
      const mockNewTechnicianName = 'Olivia Lewis';
      const mockInput = { id: mockRepairJobId, technicianName: mockNewTechnicianName };

      mockDataSources.repairJob.findRepairJobById.mockResolvedValue(mockRepairJob);

      mockDataSources.technicianRecord.findTechnicianRecordByName.mockImplementation(async (name) => {
        if (name === mockBenjaminHallRecord.name) return mockBenjaminHallRecord;
        if (name === mockNewTechnicianName) return null;

        return null;
      });
      mockDataSources.technicianRecord.updateTechnicianStatus.mockResolvedValue();

      await expect(reassignTechnicianResolver({}, { input: mockInput })).rejects.toThrow(
        `Technician ${mockNewTechnicianName} not found.`
      );

      expect(mockDataSources.technicianRecord.findTechnicianRecordByName).toHaveBeenCalledWith(mockNewTechnicianName);
    });
  });

  describe('updateElevatorRecord', () => {
    it('should update elevator record', async () => {
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

      mockDataSources.elevatorRecord.updateElevatorRecord.mockResolvedValue(mockUpdatedElevatorRecord);

      const result = await updateElevatorRecordResolver({}, { input: mockInput });

      expect(mockDataSources.elevatorRecord.updateElevatorRecord).toHaveBeenCalledWith(mockInput);
      expect(result).toEqual(mockUpdatedElevatorRecord);
    });
  });

  describe('deleteElevatorRecord', () => {
    it('should delete elevator record', async () => {
      mockDataSources.elevatorRecord.deleteElevatorRecord.mockResolvedValue(mockElevatorRecord);

      const result = await deleteElevatorRecordResolver({}, { id: mockElevatorRecord.id });

      expect(mockDataSources.elevatorRecord.deleteElevatorRecord).toHaveBeenCalledWith(mockElevatorRecord.id);
      expect(result).toEqual({ id: mockElevatorRecord.id });
    });
  });

  describe('createTechnicianRecord', () => {
    it('should create technician record', async () => {
      const mockInput = {
        availabilityStatus: mockBenjaminHallRecord.availabilityStatus,
        certifications: mockBenjaminHallRecord.certifications,
        contactInformation: mockBenjaminHallRecord.contactInformation,
        employmentStatus: mockBenjaminHallRecord.employmentStatus,
        name: mockBenjaminHallRecord.name,
        skills: mockBenjaminHallRecord.skills,
      };

      mockDataSources.technicianRecord.createTechnicianRecord.mockResolvedValue(mockBenjaminHallRecord);

      const result = await createTechnicianRecordResolver({}, { input: mockInput });

      expect(mockDataSources.technicianRecord.createTechnicianRecord).toHaveBeenCalledWith(mockInput);
      expect(result).toEqual(mockBenjaminHallRecord);
    });
  });

  describe('updateTechnicianRecord', () => {
    it('should update elevator record', async () => {
      const mockInput = {
        id: mockBenjaminHallRecord.id,
        skills: ['New Test Skill'],
      };
      const mockUpdatedTechnicianRecord = {
        ...mockBenjaminHallRecord,
        skills: ['New Test Skill'],
      };

      mockDataSources.technicianRecord.updateTechnicianRecord.mockResolvedValue(mockUpdatedTechnicianRecord);

      const result = await updateTechnicianRecordResolver({}, { input: mockInput });

      expect(mockDataSources.technicianRecord.updateTechnicianRecord).toHaveBeenCalledWith(mockInput);
      expect(result).toEqual(mockUpdatedTechnicianRecord);
    });
  });

  describe('deleteTechnicianRecord', () => {
    it('should delete technician record', async () => {
      mockDataSources.technicianRecord.deleteTechnicianRecord.mockResolvedValue(mockBenjaminHallRecord);

      const result = await deleteTechnicianRecordResolver({}, { id: mockBenjaminHallRecord.id });

      expect(mockDataSources.technicianRecord.deleteTechnicianRecord).toHaveBeenCalledWith(mockBenjaminHallRecord.id);
      expect(result).toEqual({ id: mockBenjaminHallRecord.id });
    });
  });

  describe('signUp', () => {
    it('should create a new user', async () => {
      const mockInput: CreateUserInput = {
        email: 'test@gmail.com',
        password: 'test-password',
        firstName: 'Mike',
        lastName: 'Arrow',
        emailRedirectTo: 'http://localhost/welcome-new-user',
      };

      mockDataSources.auth.signUp.mockResolvedValue(mockSupabaseUser);

      const result = await signUpResolver({}, { input: mockInput });

      expect(mockDataSources.auth.signUp).toHaveBeenCalledWith(mockInput);
      expect(result).toEqual({ id: mockSupabaseUser.id });
    });
  });

  describe('signIn', () => {
    it('should sign-in an existing user', async () => {
      const mockInput: SignInUserInput = {
        email: 'test@gmail.com',
        password: 'test-password',
      };

      mockDataSources.auth.signIn.mockResolvedValue(mockSupabaseUser);

      const result = await signInResolver({}, { input: mockInput });

      expect(mockDataSources.auth.signIn).toHaveBeenCalledWith(mockInput);
      expect(result).toEqual({ id: mockSupabaseUser.id });
    });
  });

  describe('signInWithOAuth', () => {
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
  });

  describe('signOut', () => {
    it('should signOut an existing user', async () => {
      mockDataSources.auth.signOut.mockResolvedValue(true);

      const result = await signOutResolver();

      expect(result).toEqual(true);
    });
  });

  describe('forgotPassword', () => {
    it("should successfully reset user's forgotten password", async () => {
      const mockEmail = 'test@gmail.com';
      const mockRedirectToUrl = 'https://test-redirect-url.com';

      const mockInput = {
        email: mockEmail,
        redirectTo: mockRedirectToUrl,
      };

      mockDataSources.auth.forgotPassword.mockResolvedValue(true);

      const result = await forgotPasswordResolver({}, { input: mockInput });

      expect(mockDataSources.auth.forgotPassword).toHaveBeenCalledWith(mockEmail, mockRedirectToUrl);
      expect(result).toEqual(true);
    });
  });

  describe('resetPassword', () => {
    it("should successfully update the user's password after it was reset", async () => {
      const mockPassword = 'new-test-password';

      mockDataSources.auth.resetPassword.mockResolvedValue(mockSupabaseUser);

      const result = await resetPasswordResolver({}, { input: { password: mockPassword } });

      expect(mockDataSources.auth.resetPassword).toHaveBeenCalledWith(mockPassword);
      expect(result).toEqual(mockSupabaseUser);
    });
  });

  describe('uploadProfilePicture', () => {
    it("should upload user's profile picture", async () => {
      const mockFile = createMockFile();

      mockDataSources.user.uploadProfilePicture.mockResolvedValue(mockUser);

      const result = await uploadProfilePictureResolver({}, { file: mockFile });

      expect(mockDataSources.user.uploadProfilePicture).toHaveBeenCalledWith(mockFile);
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile', async () => {
      const mockNewPhoneNumber = '+380666188618';
      const mockInput = {
        phone: mockNewPhoneNumber,
      };

      const mockUpdatedUser = {
        ...mockUser,
        phone: mockNewPhoneNumber,
      };

      mockDataSources.user.updateUserProfile.mockResolvedValue(mockUpdatedUser);

      const result = await updateUserProfileResolver({}, { input: mockInput });

      expect(mockDataSources.user.updateUserProfile).toHaveBeenCalledWith({ phone: mockNewPhoneNumber });
      expect(result).toEqual(mockUpdatedUser);
    });
  });
});
