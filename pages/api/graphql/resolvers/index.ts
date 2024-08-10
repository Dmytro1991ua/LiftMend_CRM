import { Resolvers } from '@apollo/client';

import Mutation from './Mutation';
import Query from './Query';

const resolvers: Resolvers = {
  Query,
  Mutation,
};

export default resolvers;
