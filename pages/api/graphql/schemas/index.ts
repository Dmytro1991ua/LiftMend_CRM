import { mergeTypeDefs } from '@graphql-tools/merge';

import calendarEventSchema from './calendarEvent.graphql';
import dashboardSchema from './dashboard.graphql';
import elevatorRecordSchema from './elevatorRecord.graphql';
import mutationSchema from './mutation.graphql';
import notificationSchema from './notification.graphql';
import paginationSchema from './pagination.graphql';
import querySchema from './query.graphql';
import repairJobSchema from './repairJob.graphql';
import scalarSchema from './scalar.graphql';
import technicianRecordSchema from './technicianRecord.graphql';
import userSchema from './user.graphql';

const schemas = [
  calendarEventSchema,
  elevatorRecordSchema,
  paginationSchema,
  querySchema,
  repairJobSchema,
  scalarSchema,
  technicianRecordSchema,
  userSchema,
  mutationSchema,
  dashboardSchema,
  notificationSchema,
];

export const typeDefs = mergeTypeDefs(schemas);
