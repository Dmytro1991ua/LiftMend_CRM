import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { User } from '@supabase/supabase-js';
import processRequest from 'graphql-upload/processRequest.mjs';
import { NextApiRequest, NextApiResponse } from 'next';
import getRawBody from 'raw-body';

import { getSupabaseServer } from '@/lib/supabase-server';
import prisma from '@/prisma/db';

import { MAX_FILES, MAX_FILE_SIZE } from './constants';
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

// Create the Apollo Server Next.js handler.
const handler = startServerAndCreateNextHandler(server, {
  context: async (req, res): Promise<Context> => {
    const supabase = getSupabaseServer(req, res);

    const authHeader = req.headers.authorization ?? '';
    const token = authHeader.split(' ')[1];

    let user: User | null = null;

    if (token) {
      const { data, error } = await supabase.auth.getUser(token);
      if (error) throw new Error(error.message);

      user = data.user;
    }

    return {
      req,
      res,
      prisma,
      dataSources: createDataSources(prisma, supabase),
      user,
      supabase,
    };
  },
});

/**
 * Helper function to parse the request body.
 * - For multipart/form-data, it uses processRequest from graphql-upload.
 * - For application/json, it uses raw-body to get the JSON string and parse it.
 */
async function parseRequestBody(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const contentType = req.headers['content-type'] || '';
  if (req.method === 'POST') {
    if (contentType.startsWith('multipart/form-data')) {
      const body = await processRequest(req, res, {
        maxFileSize: MAX_FILE_SIZE,
        maxFiles: MAX_FILES,
      });

      req.body = body;
    } else if (contentType.startsWith('application/json')) {
      const rawBody = await getRawBody(req, { encoding: 'utf8' });

      req.body = rawBody ? JSON.parse(rawBody) : {};
    }
  }
}

/** Main Next.js API route handler */
export default async function nextHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await parseRequestBody(req, res);
  } catch (err) {
    console.error('Error parsing request body:', err);

    res.status(400).send(err);
    return;
  }
  return handler(req, res);
}

// Disable Next.js' built-in body parsing so that we can handle multipart data.
export const config = {
  api: {
    bodyParser: false,
  },
};
