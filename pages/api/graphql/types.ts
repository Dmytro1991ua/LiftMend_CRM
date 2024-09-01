import { PrismaClient } from '@prisma/client';

export type Context = {
  prisma: PrismaClient;
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
