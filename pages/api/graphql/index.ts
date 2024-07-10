import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';

import prisma from '@/prisma/db';

import resolvers from './resolvers';
import typeDefs from './schemas';
import { Context } from './types';

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

const server = new ApolloServer<Context>({
  schema,
  introspection: process.env.NODE_ENV !== 'production',
});

export default startServerAndCreateNextHandler(server, {
  context: async (req, res) => ({
    req,
    res,
    prisma,
  }),
});
