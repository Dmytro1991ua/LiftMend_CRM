import { changeLogPrismaMock } from '@/mocks/gql/prismaMocks';
import { changeLogPrismaClient } from '@/prisma/db';
import { ChangeLogCreateParams } from '@/prisma/types';
import { createChangeLogEntry } from '@/prisma/utils';

jest.mock('@/prisma/db', () => ({
  changeLogPrismaClient: changeLogPrismaMock,
}));

describe('createChangeLogEntry', () => {
  const mockParams: ChangeLogCreateParams = {
    entityType: 'RepairJob',
    entityId: 'job-1',
    action: 'create',
    oldValue: null,
    newValue: { id: 'job-1', status: 'OPEN' },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call prisma.changeLog.create with correct data', async () => {
    await createChangeLogEntry(mockParams, 'user-1');

    expect(changeLogPrismaClient.changeLog.create).toHaveBeenCalledWith({
      data: {
        userId: 'user-1',
        entityType: mockParams.entityType,
        entityId: mockParams.entityId,
        action: mockParams.action,
        field: '*',
        oldValue: null,
        newValue: JSON.stringify(mockParams.newValue),
      },
    });
  });

  it('should handle errors gracefully', async () => {
    (changeLogPrismaClient.changeLog.create as jest.Mock).mockRejectedValueOnce(new Error('DB error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await createChangeLogEntry(mockParams, 'user-1');

    expect(consoleSpy).toHaveBeenCalledWith('Failed to create change log entry:', mockParams, expect.any(Error));
  });
});
