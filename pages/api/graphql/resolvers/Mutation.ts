import { startCase as _startCase } from 'lodash';

import {
  AppUser,
  AuthResponse,
  DeleteCalendarAndRepairJobResponse,
  DeleteElevatorRecordResponse,
  DeleteTechnicianRecordResponse,
  ElevatorRecord,
  MutationResolvers,
  RemoveAccountResponse,
  RepairJob,
  TechnicianRecord,
  UploadProfilePicturePayload,
} from '@/graphql/types/server/generated_types';

import {
  REPAIR_JOB_STATUS_TO_ELEVATOR_RECORD_STATUS_MAP,
  REPAIR_JOB_STATUS_TO_TECHNICIAN_AVAILABILITY_STATUS_MAP,
} from '../constants';
import { getElevatorStatusErrorMessage } from '../utils/utils';

import { ScheduledEventAndRepairJobResponse } from './../../../../graphql/types/server/generated_types';

const Mutation: MutationResolvers = {
  createRepairJobAndEvent: async (
    _,
    { repairJobInput, calendarEventInput },
    { dataSources }
  ): Promise<ScheduledEventAndRepairJobResponse> => {
    // Validate if the technician is available (not assigned to another job) before repair job and calendar event creation
    const technicianRecord = await dataSources.technicianRecord.validateTechnicianAssignment(
      repairJobInput.technicianId,
      repairJobInput.technicianName
    );

    // Validate the elevator record before repair job and calendar event creation
    const elevatorRecord = await dataSources.elevatorRecord.findElevatorRecordByRepairJob(repairJobInput);

    if (!elevatorRecord) {
      throw new Error(
        `Elevator not found for ${repairJobInput.buildingName}, ${repairJobInput.elevatorLocation}, ${repairJobInput.elevatorType}`
      );
    }
    const elevatorStatusErrorMessage = getElevatorStatusErrorMessage(repairJobInput)[elevatorRecord?.status ?? ''];

    if (elevatorStatusErrorMessage) {
      throw new Error(elevatorStatusErrorMessage);
    }

    // Create repair job and calendar event only when the elevator record passes validation
    const repairJob = await dataSources.repairJob.createRepairJob(
      repairJobInput,
      elevatorRecord?.id,
      technicianRecord?.id
    );
    const calendarEvent = await dataSources.calendarEvent.createCalendarEvent(calendarEventInput, repairJob.id);

    // Update the RepairJob with the CalendarEvent ID
    const updatedRepairJob = await dataSources.repairJob.updateRepairJobWithCalendarEventId(
      repairJob.id,
      calendarEvent?.id
    );

    // Update the elevator status to 'Under Maintenance' upon successful repair job creation
    await dataSources.elevatorRecord.updateElevatorStatus(elevatorRecord?.id ?? '', 'Under Maintenance');

    // Update Technician availability to 'Busy' upon successful repair job creation
    await dataSources.technicianRecord.updateTechnicianStatus(technicianRecord.id, 'Busy');

    return {
      repairJob: updatedRepairJob,
      calendarEvent,
    };
  },
  deleteRepairJobAndEvent: async (
    _,
    { calendarEventId, repairJobId },
    { dataSources }
  ): Promise<DeleteCalendarAndRepairJobResponse> => {
    // Validate the repair job exists
    const repairJob = await dataSources.repairJob.findRepairJobById(repairJobId);

    // Delete the calendar event and repair job
    const deletedEvent = await dataSources.calendarEvent.deleteCalendarEvent(calendarEventId);
    const deletedRepairJob = await dataSources.repairJob.deleteRepairJob(repairJobId);

    // Update Technician status
    const technicianRecord = await dataSources.technicianRecord.findTechnicianRecordById(repairJob?.technicianId);
    await dataSources.technicianRecord.updateTechnicianStatus(technicianRecord?.id ?? '', 'Available');

    // Find the elevator associated with the repair job and update its status to Operational
    const elevatorRecord = (await dataSources.elevatorRecord.findElevatorRecordById(
      repairJob?.elevatorId
    )) as ElevatorRecord;
    await dataSources.elevatorRecord.updateElevatorStatus(elevatorRecord.id, 'Operational');

    return {
      deletedEventId: deletedEvent.id,
      deletedRepairJobId: deletedRepairJob.id,
    };
  },
  updateRepairJob: async (_, { input }, { dataSources }): Promise<RepairJob> => {
    // Update the repair job
    const updatedRepairJob = await dataSources.repairJob.updateRepairJob(input);

    // Update technician's availability based on the repair job status
    const technicianRecord = await dataSources.technicianRecord.findTechnicianRecordById(updatedRepairJob.technicianId);

    const updatedTechnicianAvailabilityStatus =
      REPAIR_JOB_STATUS_TO_TECHNICIAN_AVAILABILITY_STATUS_MAP[_startCase(updatedRepairJob.status).replace(/\s+/g, '')];

    await dataSources.technicianRecord.updateTechnicianStatus(
      technicianRecord?.id ?? '',
      updatedTechnicianAvailabilityStatus
    );

    // Update elevator status based on repair job status
    const elevatorRecord = (await dataSources.elevatorRecord.findElevatorRecordById(
      updatedRepairJob.elevatorId
    )) as ElevatorRecord;

    const updatedElevatorStatus =
      REPAIR_JOB_STATUS_TO_ELEVATOR_RECORD_STATUS_MAP[_startCase(updatedRepairJob.status).replace(/\s+/g, '')];

    await dataSources.elevatorRecord.updateElevatorStatus(elevatorRecord.id, updatedElevatorStatus);

    if (updatedRepairJob.status === 'Completed') {
      await dataSources.elevatorRecord.updateElevatorMaintenanceDates(elevatorRecord.id, elevatorRecord.elevatorType);
    }

    return updatedRepairJob;
  },
  reassignTechnician: async (_, { input }, { dataSources }): Promise<RepairJob> => {
    const { id, technicianId, technicianName } = input;

    const repairJob = await dataSources.repairJob.findRepairJobById(id);

    if (!repairJob) {
      throw new Error(`Repair job with ID ${id} not found.`);
    }

    // Check if the new technician is the same as the current one
    if (repairJob.technicianId === technicianId) {
      throw new Error(`Technician ${technicianName} is already assigned to this repair job.`);
    }

    // Unassign the current technician if any and mark them as Available
    if (repairJob.technicianId) {
      const currentTechnician = await dataSources.technicianRecord.findTechnicianRecordById(repairJob.technicianId);

      if (currentTechnician) {
        await dataSources.technicianRecord.updateTechnicianStatus(currentTechnician.id, 'Available');
      }
    }
    // Assign the new technician and change availability status to Busy
    const newTechnicianRecord = await dataSources.technicianRecord.findTechnicianRecordById(technicianId);

    if (!newTechnicianRecord) {
      throw new Error(`Technician ${technicianName} not found.`);
    }

    await dataSources.technicianRecord.updateTechnicianStatus(newTechnicianRecord.id, 'Busy');

    // Update the repair job with the new technician
    const updatedRepairJob = await dataSources.repairJob.updateRepairJob({
      id,
      technicianId: newTechnicianRecord.id,
      technicianName: newTechnicianRecord.name,
    });

    return updatedRepairJob;
  },
  updateElevatorRecord: async (_, { input }, { dataSources }): Promise<ElevatorRecord> => {
    const updatedElevatorRecord = await dataSources.elevatorRecord.updateElevatorRecord(input);

    return updatedElevatorRecord;
  },

  deleteElevatorRecord: async (_, { id }, { dataSources }): Promise<DeleteElevatorRecordResponse> => {
    const deletedElevatorRecord = await dataSources.elevatorRecord.deleteElevatorRecord(id);

    return {
      id: deletedElevatorRecord.id,
    };
  },

  createTechnicianRecord: async (_, { input }, { dataSources }): Promise<TechnicianRecord> => {
    const technicianRecord = await dataSources.technicianRecord.createTechnicianRecord(input);

    return technicianRecord;
  },

  updateTechnicianRecord: async (_, { input }, { dataSources }): Promise<TechnicianRecord> => {
    const updatedTechnician = await dataSources.technicianRecord.updateTechnicianRecord(input);

    return updatedTechnician;
  },

  deleteTechnicianRecord: async (_, { id }, { dataSources }): Promise<DeleteTechnicianRecordResponse> => {
    const deletedTechnicianRecord = await dataSources.technicianRecord.deleteTechnicianRecord(id);

    return {
      id: deletedTechnicianRecord.id,
    };
  },
  signUp: async (_, { input }, { dataSources }): Promise<AuthResponse> => {
    const user = await dataSources.auth.signUp(input);

    return {
      id: user.id,
    };
  },
  signIn: async (_, { input }, { dataSources }): Promise<AuthResponse> => {
    const user = await dataSources.auth.signIn(input);

    return {
      id: user.id,
    };
  },
  signInWithOAuth: async (_, { input }, { dataSources }) => {
    const { provider } = input;

    return await dataSources.auth.signInWithOAuth(provider);
  },
  signOut: async (_, __, { dataSources }): Promise<boolean> => {
    return await dataSources.auth.signOut();
  },
  forgotPassword: async (_, { input }, { dataSources }): Promise<boolean> => {
    const { email, redirectTo } = input;

    return await dataSources.auth.forgotPassword(email, redirectTo);
  },
  resetPassword: async (_, { input }, { dataSources }): Promise<AuthResponse> => {
    const { password } = input;

    return await dataSources.auth.resetPassword(password);
  },
  uploadProfilePicture: async (_, { file }, { dataSources }): Promise<UploadProfilePicturePayload> => {
    return await dataSources.user.uploadProfilePicture(file);
  },
  updateUserProfile: async (_, { input }, { dataSources }): Promise<AppUser> => {
    return await dataSources.user.updateUserProfile(input);
  },
  removeAccount: async (_, { userId }, { dataSources }): Promise<RemoveAccountResponse> => {
    await dataSources.user.removeAccount(userId);

    return {
      userId,
    };
  },
  markNotificationAsRead: async (_, { input }, { dataSources }) => {
    const { id } = input;

    return await dataSources.notification.markAsRead(id);
  },
  markAllNotificationsAsRead: async (_, __, { dataSources }) => {
    return await dataSources.notification.markAllAsRead();
  },
  completeElevatorInspection: async (_, { elevatorId }, { dataSources }) => {
    return await dataSources.elevatorRecord.completeElevatorInspection(elevatorId);
  },
};

export default Mutation;
