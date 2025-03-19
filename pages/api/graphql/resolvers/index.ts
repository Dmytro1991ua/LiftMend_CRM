import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

import Mutation from './Mutation';
import Query from './Query';

const resolvers = {
  Upload: GraphQLUpload,
  Query,
  Mutation,
};

export default resolvers;
