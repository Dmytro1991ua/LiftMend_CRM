import { NextApiRequest, NextApiResponse } from 'next';

import { repairJobServicePrismaMock } from '@/mocks/gql/prismaMocks';
import handler from '@/pages/api/crons/repair-job-overdue';

jest.mock('@/prisma/db', () => repairJobServicePrismaMock);
jest.mock('@/pages/api/graphql/utils/utils');

describe('Repair Job Overdue Cron API', () => {
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

  it('should update overdue statuses on repair jobs', async () => {
    (repairJobServicePrismaMock.repairJob.findMany as jest.Mock).mockResolvedValue([
      { id: '1', endDate: new Date(), status: 'OPEN', isOverdue: false },
    ]);
    (repairJobServicePrismaMock.repairJob.update as jest.Mock).mockResolvedValue({ id: '1', isOverdue: true });

    await handler(mockRequest, mockResponse);

    expect(repairJobServicePrismaMock.repairJob.findMany).toHaveBeenCalled();
    expect(repairJobServicePrismaMock.repairJob.update).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ updatedCount: 1 }));
  });

  it('should handle errors gracefully', async () => {
    (repairJobServicePrismaMock.repairJob.findMany as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

    await handler(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'DB error' }));
  });
});
