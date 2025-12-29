import { QueryGetChangeLogsArgs } from '@/graphql/types/server/generated_types';
import { mockCalendarEventChangeLog, mockRepairJobChangeLog } from '@/mocks/changeLogMocks';
import { changeLogPrismaMock } from '@/mocks/gql/prismaMocks';
import ChangeLogService from '@/pages/api/graphql/dataSources/ChangeLogService';
import { DEFAULT_SORTING_OPTION } from '@/pages/api/graphql/dataSources/constants';
import { createChangeLogFilterOptions, makeConnectionObject } from '@/pages/api/graphql/utils/utils';

jest.mock('@/pages/api/graphql/utils/utils', () => ({
  ...jest.requireActual('@/pages/api/graphql/utils/utils'),
  makeConnectionObject: jest.fn(),
  createChangeLogFilterOptions: jest.fn(),
}));

describe('ChangeLogService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const changeLogService = new ChangeLogService(changeLogPrismaMock);

  describe('changeLogs', () => {
    const mockArgs = {
      paginationOptions: { offset: 5, limit: 10 },
      filterOptions: { action: 'update' },
    } as unknown as QueryGetChangeLogsArgs;

    const mockFilters = { action: 'update' };
    const mockOrderBy = { createdAt: DEFAULT_SORTING_OPTION };
    const mockChangeLogs = [mockRepairJobChangeLog, mockCalendarEventChangeLog];
    const mockTotalItems = 2;
    const mockConnection = {
      edges: [],
      pageInfo: {},
      totalCount: mockTotalItems,
    };

    beforeEach(() => {
      (createChangeLogFilterOptions as jest.Mock).mockReturnValue(mockFilters);
      (makeConnectionObject as jest.Mock).mockReturnValue(mockConnection);
    });

    it('should fetch notifications with correct prisma calls and return connection object', async () => {
      (changeLogPrismaMock.changeLog.findMany as jest.Mock).mockResolvedValue(mockChangeLogs);
      (changeLogPrismaMock.changeLog.count as jest.Mock).mockResolvedValue(mockTotalItems);

      const result = await changeLogService.changeLogs(mockArgs);

      expect(changeLogPrismaMock.changeLog.findMany).toHaveBeenCalledWith({
        where: mockFilters,
        orderBy: mockOrderBy,
        skip: 5,
        take: 10,
      });

      expect(changeLogPrismaMock.changeLog.count).toHaveBeenCalledWith({
        where: mockFilters,
      });

      expect(makeConnectionObject).toHaveBeenCalledWith({
        items: mockChangeLogs,
        totalItems: mockTotalItems,
        paginationOptions: mockArgs.paginationOptions,
        getCursor: expect.any(Function),
      });

      expect(result).toEqual(mockConnection);
    });
  });
});
