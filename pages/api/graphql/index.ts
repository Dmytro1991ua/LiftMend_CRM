import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { User } from '@supabase/supabase-js';

import { getSupabaseServer } from '@/lib/supabase-server';
import prisma from '@/prisma/db';

import { createDataSources } from './dataSources';
import resolvers from './resolvers';
import { typeDefs } from './schemas';
import { Context } from './types';

const schema = makeExecutableSchema<Context>({
  resolvers,
  typeDefs,
});

const server = new ApolloServer<Context>({
  schema,
  introspection: process.env.NODE_ENV !== 'production',
});

export default startServerAndCreateNextHandler(server, {
  context: async (req, res): Promise<Context> => {
    const supabase = getSupabaseServer(req, res);

    // Extract the Bearer token from the Authorization header
    const authHeader = req.headers.authorization ?? '';
    const token = authHeader?.split(' ')[1]; // Extract the token from "Bearer <token>"

    let user: User | null = null;

    // If token exists, validate it using Supabase's auth helper
    if (token) {
      const { data, error } = await supabase.auth.getUser(token);

      if (error) {
        throw new Error(error.message);
      } else {
        user = data.user;
      }
    }

    // Return the context with the user and other necessary data
    return {
      req,
      res,
      prisma,
      dataSources: createDataSources(prisma),
      user,
      supabase,
    };
  },
});
