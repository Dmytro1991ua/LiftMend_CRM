import { startCase as _startCase } from 'lodash';

import {
  CalendarEvent,
  DeleteCalendarAndRepairJobResponse,
  DeleteElevatorRecordResponse,
  DeleteTechnicianRecordResponse,
  ElevatorRecord,
  MutationResolvers,
  RepairJob,
  TechnicianRecord,
} from '@/graphql/types/server/generated_types';

import { ScheduledEventAndRepairJobResponse } from './../../../../graphql/types/server/generated_types';
import { REPAIR_JOB_STATUS_TO_TECHNICIAN_AVAILABILITY_STATUS_MAP } from './constants';

const Mutation: MutationResolvers = {
  createRepairJobAndEvent: async (
    _,
    { repairJobInput, calendarEventInput },
    { prisma }
  ): Promise<ScheduledEventAndRepairJobResponse> => {
    const repairJob = await prisma.repairJob.create({
      data: repairJobInput,
    });

    // Create the CalendarEvent with the repairJobId set to the newly created RepairJob's ID
    const calendarEvent: CalendarEvent = await prisma.calendarEvent.create({
      data: {
        ...calendarEventInput,
        repairJobId: repairJob.id,
      },
    });

    // Update the RepairJob to include the CalendarEvent ID
    const updatedRepairJob: RepairJob = await prisma.repairJob.update({
      where: { id: repairJob.id },
      data: { calendarEventId: calendarEvent.id },
    });

    const technicianRecord: TechnicianRecord = await prisma.technicianRecord.findFirst({
      where: { name: updatedRepairJob.technicianName },
    });

    // Update Technician available status upon repair job creation
    await prisma.technicianRecord.update({
      where: { id: technicianRecord.id },
      data: { availabilityStatus: 'Busy' },
    });

    return {
      repairJob: updatedRepairJob,
      calendarEvent,
    };
  },
  deleteRepairJobAndEvent: async (
    _,
    { calendarEventId, repairJobId },
    { prisma }
  ): Promise<DeleteCalendarAndRepairJobResponse> => {
    const deletedEvent: CalendarEvent = await prisma.calendarEvent.delete({
      where: {
        id: calendarEventId,
      },
    });

    const deletedRepairJob: RepairJob = await prisma.repairJob.delete({
      where: {
        id: repairJobId,
      },
    });

    const technicianRecord: TechnicianRecord = await prisma.technicianRecord.findFirst({
      where: { name: deletedRepairJob.technicianName },
    });

    // Update Technician available status upon repair job deletion
    await prisma.technicianRecord.update({
      where: { id: technicianRecord.id },
      data: { availabilityStatus: 'Available' },
    });

    return {
      deletedEventId: deletedEvent.id,
      deletedRepairJobId: deletedRepairJob.id,
    };
  },
  updateRepairJob: async (_, { input }, { prisma }): Promise<RepairJob> => {
    const { id, ...fieldsToUpdate } = input;

    const updatedRepairJob: RepairJob = await prisma.repairJob.update({
      where: { id },
      data: { ...fieldsToUpdate },
    });

    const technicianRecord: TechnicianRecord = await prisma.technicianRecord.findFirst({
      where: { name: updatedRepairJob.technicianName },
    });

    const updatedTechnicianAvailabilityStatus =
      REPAIR_JOB_STATUS_TO_TECHNICIAN_AVAILABILITY_STATUS_MAP[_startCase(updatedRepairJob.status).replace(/\s+/g, '')];

    await prisma.technicianRecord.update({
      where: { id: technicianRecord.id },
      data: { availabilityStatus: updatedTechnicianAvailabilityStatus },
    });

    return updatedRepairJob;
  },
  updateElevatorRecord: async (_, { input }, { prisma }): Promise<ElevatorRecord> => {
    const { id, ...fieldsToUpdate } = input;

    const updatedElevatorRecord: ElevatorRecord = await prisma.elevatorRecord.update({
      where: { id },
      data: { ...fieldsToUpdate },
    });

    return updatedElevatorRecord;
  },
  deleteElevatorRecord: async (_, { id }, { prisma }): Promise<DeleteElevatorRecordResponse> => {
    const deletedElevatorRecord: ElevatorRecord = await prisma.elevatorRecord.delete({
      where: {
        id,
      },
    });

    return {
      id: deletedElevatorRecord.id,
    };
  },
  createTechnicianRecord: async (_, { input }, { prisma }): Promise<TechnicianRecord> => {
    const technicianRecord: TechnicianRecord = await prisma.technicianRecord.create({
      data: input,
    });

    return technicianRecord;
  },
  updateTechnicianRecord: async (_, { input }, { prisma }): Promise<TechnicianRecord> => {
    const { id, ...fieldsToUpdate } = input;

    const updatedTechnician: TechnicianRecord = await prisma.technicianRecord.update({
      where: { id },
      data: { ...fieldsToUpdate },
    });

    return updatedTechnician;
  },
  updateEmploymentStatus: async (
    _,
    { id, employmentStatus, availabilityStatus, lastKnownAvailabilityStatus },
    { prisma }
  ): Promise<TechnicianRecord> => {
    const updatedTechnician: TechnicianRecord = await prisma.technicianRecord.update({
      where: { id },
      data: { employmentStatus, availabilityStatus, lastKnownAvailabilityStatus },
    });

    return updatedTechnician;
  },
  deleteTechnicianRecord: async (_, { id }, { prisma }): Promise<DeleteTechnicianRecordResponse> => {
    const deletedTechnicianRecord = await prisma.technicianRecord.delete({
      where: {
        id,
      },
    });

    return {
      id: deletedTechnicianRecord.id,
    };
  },
};

export default Mutation;
