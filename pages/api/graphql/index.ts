import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';

import resolvers from './resolvers';
import typeDefs from './schemas';

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

const server = new ApolloServer({
  schema,
  introspection: process.env.NODE_ENV !== 'production',
});

export default startServerAndCreateNextHandler(server);
