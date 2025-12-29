import { ChangeLog, Prisma, PrismaClient } from '@prisma/client';

import { ChangeLogConnection, QueryGetChangeLogsArgs } from '@/graphql/types/server/generated_types';

import { createChangeLogFilterOptions, makeConnectionObject } from '../utils/utils';

import { DEFAULT_SORTING_OPTION } from './constants';

class ChangeLogService {
  private prisma;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async changeLogs(args: QueryGetChangeLogsArgs): Promise<ChangeLogConnection> {
    const { paginationOptions, filterOptions } = args;

    const filters = createChangeLogFilterOptions(filterOptions);

    const queryOptions: Prisma.ChangeLogFindManyArgs = {
      where: filters,
      orderBy: { createdAt: DEFAULT_SORTING_OPTION },
    };

    if (paginationOptions) {
      queryOptions.skip = paginationOptions.offset ?? undefined;
      queryOptions.take = paginationOptions.limit ?? undefined;
    }

    const changeLogs = await this.prisma.changeLog.findMany(queryOptions);

    const totalItems = await this.prisma.changeLog.count({
      where: filters,
    });

    return makeConnectionObject({
      items: changeLogs,
      totalItems,
      paginationOptions,
      getCursor: (changeLog: ChangeLog) => changeLog.id,
    });
  }
}

export default ChangeLogService;
