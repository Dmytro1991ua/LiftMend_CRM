import { PrismaClient } from '@prisma/client';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';

import { DataSources } from './dataSources';

export type Context = {
  req: NextApiRequest;
  res: NextApiResponse;
  prisma: PrismaClient;
  dataSources: DataSources;
  user: User | null;
  supabase: SupabaseClient;
};

export type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
};

export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

export type Edge<T> = {
  cursor: string;
  node: T;
};

export type Connection<T> = {
  edges: Edge<T>[];
  pageInfo: PageInfo;
  total: number;
};
