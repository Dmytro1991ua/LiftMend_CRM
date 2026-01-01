import { PrismaClient } from '@prisma/client';
import { SupabaseClient, User } from '@supabase/supabase-js';
import DataLoader from 'dataloader';
import { FieldNode } from 'graphql';
import { NextApiRequest, NextApiResponse } from 'next';

import { DataSources } from './dataSources';

export type GraphQLDataLoaders = WeakMap<readonly FieldNode[], DataLoader<string, unknown, string>>;

export type Context = {
  req: NextApiRequest;
  res: NextApiResponse;
  prisma: PrismaClient;
  dataSources: DataSources;
  dataLoaders: GraphQLDataLoaders;
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

export type JSONRecord = Record<string, unknown>;
