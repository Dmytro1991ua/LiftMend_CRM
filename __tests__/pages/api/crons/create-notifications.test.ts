import { RepairJob } from '@prisma/client';
import { addDays } from 'date-fns';
import { NextApiRequest, NextApiResponse } from 'next';

import { repairJobServicePrismaMock } from '@/mocks/gql/prismaMocks';
import { mockRepairJob } from '@/mocks/repairJobTrackingMocks';
import { NOTIFICATION_RULE_CONFIG } from '@/pages/api/crons/config';
import handler from '@/pages/api/crons/create-notifications';
import { createNotificationIfNotExists } from '@/pages/api/crons/utils';

jest.mock('@/prisma/db', () => repairJobServicePrismaMock);
jest.mock('@/pages/api/crons/utils', () => ({
  createNotificationIfNotExists: jest.fn(),
}));
jest.mock('@/pages/api/graphql/utils/utils');

describe('Create Notifications Cron API', () => {
  let mockRequest: NextApiRequest;
  let mockResponse: NextApiResponse;

  const tomorrow = addDays(new Date(), 1);

  beforeEach(() => {
    mockRequest = {
      method: 'POST',
      headers: {
        authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
      body: {},
    } as NextApiRequest;

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
    } as unknown as NextApiResponse;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 405 for non-POST requests', async () => {
    mockRequest.method = 'GET';

    await handler(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(405);
    expect(mockResponse.end).toHaveBeenCalled();
  });

  it('should return 401 for unauthorized requests', async () => {
    mockRequest.headers.authorization = 'Bearer WRONG_SECRET';

    await handler(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Unauthorized' }));
  });

  it('should handle errors gracefully', async () => {
    (repairJobServicePrismaMock.repairJob.findMany as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

    await handler(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'DB error' }));
  });

  it('should create notifications for repair jobs that match rules', async () => {
    const mockJobs = [
      { ...mockRepairJob, jobPriority: 'High', startDate: tomorrow, endDate: tomorrow },
      { ...mockRepairJob, status: 'Completed', jobPriority: 'Low', startDate: tomorrow, endDate: tomorrow },
    ] as unknown as RepairJob[];

    (repairJobServicePrismaMock.repairJob.findMany as jest.Mock).mockResolvedValue(mockJobs);

    await handler(mockRequest, mockResponse);

    expect(createNotificationIfNotExists).toHaveBeenCalledTimes(
      mockJobs.filter((job) => Object.values(NOTIFICATION_RULE_CONFIG).some((rule) => rule.condition(job, tomorrow)))
        .length
    );
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Notifications generated successfully',
        createdNotificationsCount: expect.any(Number),
      })
    );
  });
});
