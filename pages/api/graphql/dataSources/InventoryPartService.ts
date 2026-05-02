import { InventoryPart, Prisma, PrismaClient } from '@prisma/client';

import { InventoryPartDropdownOption, QueryGetInventoryPartsArgs } from '@/graphql/types/server/generated_types';

import { createInventoryPartFilterOptions, createInventoryPartSortOptions, makeConnectionObject } from '../utils/utils';

class InventoryPartService {
  private prisma;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async inventoryParts(args: QueryGetInventoryPartsArgs) {
    const { paginationOptions, filterOptions, sortOptions } = args;

    const filters = createInventoryPartFilterOptions(filterOptions);
    const orderBy = createInventoryPartSortOptions(sortOptions);

    const queryOptions: Prisma.InventoryPartFindManyArgs = {
      where: filters,
      orderBy,
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

  async inventoryPartDropdownOptions(): Promise<InventoryPartDropdownOption[]> {
    const inventoryParts = await this.prisma.inventoryPart.findMany({
      select: {
        id: true,
        name: true,
        stock: true,
      },
    });

    return inventoryParts.map(({ id, stock, name }) => {
      const isOutOfStock = stock <= 0;
      const disabledReasonMessage = 'This part is currently out of stock';

      return {
        value: id,
        label: name,
        isDisabled: isOutOfStock,
        disabledReason: isOutOfStock ? disabledReasonMessage : null,
      };
    });
  }
}

export default InventoryPartService;
