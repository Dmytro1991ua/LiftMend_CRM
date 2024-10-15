import { DeleteElevatorRecordResponse, RepairJob } from '@/graphql/types/client/generated_types';
import {
  DeleteCalendarAndRepairJobResponse,
  ElevatorRecord,
  MutationResolvers,
} from '@/graphql/types/server/generated_types';

import { ScheduledEventAndRepairJobResponse } from './../../../../graphql/types/server/generated_types';

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
    const calendarEvent = await prisma.calendarEvent.create({
      data: {
        ...calendarEventInput,
        repairJobId: repairJob.id,
      },
    });

    // Update the RepairJob to include the CalendarEvent ID
    const updatedRepairJob = await prisma.repairJob.update({
      where: { id: repairJob.id },
      data: { calendarEventId: calendarEvent.id },
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
    const deletedEvent = await prisma.calendarEvent.delete({
      where: {
        id: calendarEventId,
      },
    });

    const deletedRepairJob = await prisma.repairJob.delete({
      where: {
        id: repairJobId,
      },
    });

    return {
      deletedEventId: deletedEvent.id,
      deletedRepairJobId: deletedRepairJob.id,
    };
  },
  updateRepairJob: async (_, { input }, { prisma }): Promise<RepairJob> => {
    const { id, ...fieldsToUpdate } = input;

    const updatedRepairJob = await prisma.repairJob.update({
      where: { id },
      data: { ...fieldsToUpdate },
    });

    return updatedRepairJob;
  },
  createElevatorRecord: async (_, { input }, { prisma }): Promise<ElevatorRecord> => {
    const elevatorRecord = await prisma.elevatorRecord.create({
      data: input,
    });

    return elevatorRecord;
  },
  updateElevatorRecord: async (_, { input }, { prisma }): Promise<ElevatorRecord> => {
    const { id, ...fieldsToUpdate } = input;

    const updatedElevatorRecord = await prisma.elevatorRecord.update({
      where: { id },
      data: { ...fieldsToUpdate },
    });

    return updatedElevatorRecord;
  },
  deleteElevatorRecord: async (_, { id }, { prisma }): Promise<DeleteElevatorRecordResponse> => {
    const deletedElevatorRecord = await prisma.elevatorRecord.delete({
      where: {
        id,
      },
    });

    return {
      id: deletedElevatorRecord.id,
    };
  },
};

export default Mutation;
