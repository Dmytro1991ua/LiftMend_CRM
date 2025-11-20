import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

import ElevatorRecord from './ElevatorRecord';
import Mutation from './Mutation';
import Query from './Query';

const resolvers = {
  Upload: GraphQLUpload,
  Query,
  Mutation,
  ElevatorRecord,
};

export default resolvers;
