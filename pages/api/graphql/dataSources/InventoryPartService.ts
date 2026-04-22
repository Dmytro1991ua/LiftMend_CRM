import { InventoryPart, Prisma, PrismaClient } from '@prisma/client';

import { QueryGetInventoryPartsArgs } from '@/graphql/types/server/generated_types';

import { createInventoryPartFilterOptions, makeConnectionObject } from '../utils/utils';

import { DEFAULT_SORTING_OPTION } from './constants';

class InventoryPartService {
  private prisma;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async inventoryParts(args: QueryGetInventoryPartsArgs) {
    const { paginationOptions, filterOptions } = args;

    const filters = createInventoryPartFilterOptions(filterOptions);

    const queryOptions: Prisma.InventoryPartFindManyArgs = {
      where: filters,
      orderBy: { createdAt: DEFAULT_SORTING_OPTION },
    };

    if (paginationOptions) {
      queryOptions.skip = paginationOptions.offset ?? undefined;
      queryOptions.take = paginationOptions.limit ?? undefined;
    }

    const inventoryParts = await this.prisma.inventoryPart.findMany(queryOptions);

    const totalItems = await this.prisma.inventoryPart.count({
      where: filters,
    });

    return makeConnectionObject({
      items: inventoryParts,
      totalItems,
      paginationOptions,
      getCursor: (inventoryPart: InventoryPart) => inventoryPart.id,
    });
  }
}

export default InventoryPartService;
