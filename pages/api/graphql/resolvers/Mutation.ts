import { MutationResolvers } from '@/graphql/types/server/generated_types';

import prisma from '../../../../prisma/db';

import { ScheduledEventAndRepairJobResponse } from './../../../../graphql/types/server/generated_types';

const Mutation: MutationResolvers = {
  createRepairJobAndEvent: async (
    _,
    { repairJobInput, calendarEventInput }
  ): Promise<ScheduledEventAndRepairJobResponse> => {
    const repairJob = await prisma.repairJob.create({
      data: repairJobInput,
    });

    const calendarEvent = await prisma.calendarEvent.create({
      data: calendarEventInput,
    });

    return {
      repairJob,
      calendarEvent,
    };
  },
};

export default Mutation;
