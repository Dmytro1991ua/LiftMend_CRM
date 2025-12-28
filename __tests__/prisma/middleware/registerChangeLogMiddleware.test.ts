import { Prisma, PrismaClient } from '@prisma/client';

import { registerChangeLogMiddleware } from '@/prisma/middleware/registerChangeLogMiddleware';
import { createChangeLogEntry } from '@/prisma/utils';

jest.mock('@prisma/client');
jest.mock('@/prisma/utils', () => ({
  ...jest.requireActual('@/prisma/utils'),
  createChangeLogEntry: jest.fn(),
}));

describe('registerChangeLogMiddleware', () => {
  let prisma: PrismaClient;
  let middleware: Prisma.Middleware;

  beforeEach(() => {
    prisma = {
      $use: jest.fn((fn) => {
        middleware = fn;
      }),
      RepairJob: {
        findUnique: jest.fn(),
      },
    } as unknown as PrismaClient;

    registerChangeLogMiddleware(prisma, 'user-1');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create changelog on create action', async () => {
    const mockResult = { id: '1', name: 'Job' };

    await middleware(
      { model: 'RepairJob', action: 'create', args: { data: {} }, dataPath: [], runInTransaction: false },
      jest.fn().mockResolvedValue(mockResult)
    );

    expect(createChangeLogEntry).toHaveBeenCalledWith(
      {
        entityType: 'RepairJob',
        entityId: '1',
        action: 'create',
        oldValue: null,
        newValue: mockResult,
      },
      'user-1'
    );
  });

  it('should create changelog on update action', async () => {
    const mockBefore = { id: '1', name: 'Old' };
    const mockAfter = { id: '1', name: 'New' };

    (prisma as any).RepairJob.findUnique.mockResolvedValue(mockBefore);

    await middleware(
      {
        model: 'RepairJob',
        action: 'update',
        args: { where: { id: '1' } },
        dataPath: [],
        runInTransaction: false,
      },
      jest.fn().mockResolvedValue(mockAfter)
    );

    expect(createChangeLogEntry).toHaveBeenCalledWith(
      {
        entityType: 'RepairJob',
        entityId: '1',
        action: 'update',
        oldValue: mockBefore,
        newValue: mockAfter,
      },
      'user-1'
    );
  });

  it('should create changelog on delete action', async () => {
    const mockBefore = { id: '1', name: 'Job' };

    (prisma as any).RepairJob.findUnique.mockResolvedValue(mockBefore);

    await middleware(
      {
        model: 'RepairJob',
        action: 'delete',
        args: { where: { id: '1' } },
        dataPath: [],
        runInTransaction: false,
      },
      jest.fn().mockResolvedValue({ id: '1' })
    );

    expect(createChangeLogEntry).toHaveBeenCalledWith(
      {
        entityType: 'RepairJob',
        entityId: '1',
        action: 'delete',
        oldValue: mockBefore,
        newValue: null,
      },
      'user-1'
    );
  });

  it('should ignore ChangeLog model', async () => {
    const mockNext = jest.fn().mockResolvedValue('ok');

    const result = await middleware(
      { model: 'ChangeLog', action: 'create', args: {}, dataPath: [], runInTransaction: false },
      mockNext
    );

    expect(createChangeLogEntry).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
    expect(result).toBe('ok');
  });

  it('should ignore non-write operations', async () => {
    const next = jest.fn().mockResolvedValue('ok');

    await middleware({ model: 'RepairJob', action: 'findMany', args: {}, dataPath: [], runInTransaction: false }, next);

    expect(createChangeLogEntry).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
