import { NextApiRequest, NextApiResponse } from 'next';

import { notificationServicePrismaMock } from '@/mocks/gql/prismaMocks';
import handler from '@/pages/api/crons/archive-old-notifications';
import { createAppPrismaClient } from '@/prisma/db';

jest.mock('@/prisma/db', () => ({
  createAppPrismaClient: jest.fn(),
}));
jest.mock('@/pages/api/graphql/utils/utils');

describe('Archive Old Notifications Cron API', () => {
  let mockRequest: NextApiRequest;
  let mockResponse: NextApiResponse;

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

    (createAppPrismaClient as jest.Mock).mockReturnValue(notificationServicePrismaMock);
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

  it('should archive old notifications successfully', async () => {
    (notificationServicePrismaMock.notification.updateMany as jest.Mock).mockResolvedValue({
      count: 7,
    });

    await handler(mockRequest, mockResponse);

    expect(notificationServicePrismaMock.notification.updateMany).toHaveBeenCalledTimes(1);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ archivedCount: 7, message: 'Old notifications archived' })
    );
  });

  it('should handle errors gracefully', async () => {
    (notificationServicePrismaMock.notification.updateMany as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

    await handler(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'DB error' }));
  });
});
