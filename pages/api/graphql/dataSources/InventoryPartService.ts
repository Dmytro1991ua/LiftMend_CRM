import { InventoryPart, Prisma, PrismaClient } from '@prisma/client';

import { InventoryPartDropdownOption, QueryGetInventoryPartsArgs } from '@/graphql/types/server/generated_types';

import {
  createInventoryPartFilterOptions,
  createInventoryPartSortOptions,
  getInventoryPartStatus,
  makeConnectionObject,
} from '../utils/utils';

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
      const disabledReasonMessage = 'This inventory part is currently out of stock';

      return {
        value: id,
        label: name,
        isDisabled: isOutOfStock,
        disabledReason: isOutOfStock ? disabledReasonMessage : null,
      };
    });
  }

  async processRepairJobInventoryParUsage(repairJobId: string, partsUsed: { partId: string; quantity: number }[]) {
    const inventoryPartProcessingPromises = partsUsed.map(async (item) => {
      await this.createInventoryPartUsageRecord(repairJobId, item.partId, item.quantity);

      const updatedInventoryPart = await this.decrementInventoryPartStock(item.partId, item.quantity);

      const newInventoryPartStatus = getInventoryPartStatus(updatedInventoryPart.stock, updatedInventoryPart.minStock);

      await this.updateInventoryPartStatus(item.partId, newInventoryPartStatus);
    });

    await Promise.all(inventoryPartProcessingPromises);
  }

  private async decrementInventoryPartStock(partId: string, quantity: number) {
    return this.prisma.inventoryPart.update({
      where: { id: partId },
      data: {
        stock: { decrement: quantity },
      },
    });
  }

  private async createInventoryPartUsageRecord(repairJobId: string, partId: string, quantity: number) {
    return this.prisma.inventoryPartUsage.create({
      data: {
        repairJobId,
        inventoryPartId: partId,
        quantity,
      },
    });
  }

  private async updateInventoryPartStatus(partId: string, status: string) {
    return this.prisma.inventoryPart.update({
      where: { id: partId },
      data: { status },
    });
  }
}

export default InventoryPartService;
