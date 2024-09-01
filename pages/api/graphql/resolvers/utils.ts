import { orderBy as _orderBy } from 'lodash';

import { InputMaybe, PaginationOptions } from '@/graphql/types/server/generated_types';

import { Connection, Edge, PageInfo } from '../types';

import { DEFAULT_PAGINATION } from './constants';

export const getSortedRepairJobData = async <T>(
  model: { findMany: () => Promise<T[]> },
  field: keyof T
): Promise<string[]> => {
  const data = await model.findMany();

  return _orderBy(data.flatMap((item) => item[field] as string[]));
};

export async function fetchRepairJobData<T>(fetchFunction: () => Promise<T>, label: string): Promise<T> {
  try {
    return await fetchFunction();
  } catch (error) {
    console.error(`Error fetching ${label}:`, error);
    throw new Error(`Failed to fetch ${label}: ${(error as Error).message}`);
  }
}

export const makeConnectionObject = <T>({
  items,
  totalItems,
  paginationOptions,
  getCursor,
}: {
  items: T[];
  totalItems: number;
  paginationOptions: InputMaybe<PaginationOptions>;
  getCursor: (item: T) => string;
}): Connection<T> => {
  const limit = paginationOptions?.limit ?? DEFAULT_PAGINATION.limit;
  const offset = paginationOptions?.offset ?? DEFAULT_PAGINATION.offset;

  // Create an array of edges, each containing a cursor and the node (item)
  const edges: Edge<T>[] = items.map((item) => ({
    cursor: getCursor(item), // Generate a unique cursor for each item using getCursor function
    node: item,
  }));

  const hasNextPage = offset + limit < totalItems;
  const hasPreviousPage = offset > 0;

  const pageInfo: PageInfo = {
    hasNextPage,
    hasPreviousPage,
    startCursor: edges.length > 0 ? edges[0].cursor : null, // Cursor of the first item on the page, or null if no items
    endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null, // Cursor of the last item on the page, or null if no items
  };

  return {
    edges,
    pageInfo,
    total: totalItems,
  };
};
