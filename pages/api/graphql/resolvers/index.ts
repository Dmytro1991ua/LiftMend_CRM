import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

import ChangeLog from './ChangeLog';
import ElevatorRecord from './ElevatorRecord';
import Mutation from './Mutation';
import Query from './Query';
import TechnicianRecord from './TechnicianRecord';

const resolvers = {
  Upload: GraphQLUpload,
  Query,
  Mutation,
  ElevatorRecord,
  TechnicianRecord,
  ChangeLog,
};

export default resolvers;
