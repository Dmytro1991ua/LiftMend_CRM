import { startCase as _startCase } from 'lodash';

import {
  DeleteCalendarAndRepairJobResponse,
  DeleteElevatorRecordResponse,
  DeleteTechnicianRecordResponse,
  ElevatorRecord,
  MutationResolvers,
  RepairJob,
  TechnicianRecord,
} from '@/graphql/types/server/generated_types';

import {
  REPAIR_JOB_STATUS_TO_ELEVATOR_RECORD_STATUS_MAP,
  REPAIR_JOB_STATUS_TO_TECHNICIAN_AVAILABILITY_STATUS_MAP,
} from '../constants';
import { getElevatorStatusErrorMessage } from '../utils';

import { ScheduledEventAndRepairJobResponse } from './../../../../graphql/types/server/generated_types';

const Mutation: MutationResolvers = {
  createRepairJobAndEvent: async (
    _,
    { repairJobInput, calendarEventInput },
    { dataSources }
  ): Promise<ScheduledEventAndRepairJobResponse> => {
    // Validate the elevator record before repair job and calendar event creation
    const elevatorRecord = await dataSources.elevatorRecord.validateElevator(repairJobInput);

    const elevatorStatusErrorMessage = getElevatorStatusErrorMessage(repairJobInput)[elevatorRecord.status];

    if (elevatorStatusErrorMessage) {
      throw new Error(elevatorStatusErrorMessage);
    }

    // Create repair job and calendar event only when the elevator record passes validation
    const repairJob = await dataSources.repairJob.createRepairJob(repairJobInput);
    const calendarEvent = await dataSources.calendarEvent.createCalendarEvent(calendarEventInput, repairJob.id);

    // Update the RepairJob with the CalendarEvent ID
    const updatedRepairJob = await dataSources.repairJob.updateRepairJobWithCalendarEventId(
      repairJob.id,
      calendarEvent?.id
    );

    // Update the elevator status to 'Under Maintenance' upon successful repair job creation
    await dataSources.elevatorRecord.updateElevatorStatus(elevatorRecord.id, 'Under Maintenance');

    // Update Technician availability to 'Busy' upon successful repair job creation
    await dataSources.technicianRecord.updateTechnicianStatus(updatedRepairJob.technicianName, 'Busy');

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
    const technicianRecord = await dataSources.technicianRecord.findTechnicianRecordByName(
      repairJob?.technicianName ?? ''
    );
    await dataSources.technicianRecord.updateTechnicianStatus(technicianRecord?.id ?? '', 'Available');

    // Find the elevator associated with the repair job and update its status to Operational
    const elevatorRecord = (await dataSources.elevatorRecord.findElevatorRecordByRepairJob(
      repairJob
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
    const technicianRecord = await dataSources.technicianRecord.findTechnicianRecordByName(
      updatedRepairJob.technicianName
    );

    const updatedTechnicianAvailabilityStatus =
      REPAIR_JOB_STATUS_TO_TECHNICIAN_AVAILABILITY_STATUS_MAP[_startCase(updatedRepairJob.status).replace(/\s+/g, '')];

    await dataSources.technicianRecord.updateTechnicianStatus(
      technicianRecord?.id ?? '',
      updatedTechnicianAvailabilityStatus
    );

    // Update elevator status based on repair job status
    const elevatorRecord = (await dataSources.elevatorRecord.findElevatorRecordByRepairJob(
      updatedRepairJob
    )) as ElevatorRecord;

    const updatedElevatorStatus =
      REPAIR_JOB_STATUS_TO_ELEVATOR_RECORD_STATUS_MAP[_startCase(updatedRepairJob.status).replace(/\s+/g, '')];

    await dataSources.elevatorRecord.updateElevatorStatus(elevatorRecord.id, updatedElevatorStatus);

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
};

export default Mutation;
