import { SupabaseClient } from '@supabase/supabase-js';

import { userServicePrismaMock } from '@/mocks/gql/prismaMocks';
import { userServiceSupabaseMock } from '@/mocks/gql/supabaseMocks';
import { mockUser } from '@/mocks/userMocks';
import {
  DEFAULT_IMAGE_PUBLIC_URL_FAILED_MESSAGE,
  DEFAULT_SUPABASE_NOT_INITIALIZED_MESSAGE,
  DEFAULT_USER_NOT_AUTHENTICATED_MESSAGE,
} from '@/pages/api/graphql/dataSources/constants';
import StorageService from '@/pages/api/graphql/dataSources/StorageService';
import { convertStreamToBuffer } from '@/pages/api/graphql/utils/utils';

jest.mock('@/pages/api/graphql/utils/utils', () => ({
  ...jest.requireActual('@/pages/api/graphql/utils/utils'),
  convertStreamToBuffer: jest.fn(),
}));

describe('StorageService', () => {
  beforeEach(() => {
    (convertStreamToBuffer as jest.Mock).mockReturnValue(Buffer.from('file content'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const storageService = new StorageService(userServiceSupabaseMock);

  describe('getAuthenticatedUserId', () => {
    it('should return user ID if authenticated', async () => {
      (userServiceSupabaseMock.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: mockUser } });

      const result = await storageService['getAuthenticatedUserId']();

      expect(result).toBe('test-user-id-1');
    });

    it('should throw error if user is not authenticated', async () => {
      (userServiceSupabaseMock.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: null } });

      await expect(storageService['getAuthenticatedUserId']()).rejects.toThrow(DEFAULT_USER_NOT_AUTHENTICATED_MESSAGE);
    });

    it('should throw error if supabase is not initialized', async () => {
      const service = new StorageService(undefined);

      await expect(service['getAuthenticatedUserId']()).rejects.toThrow(DEFAULT_SUPABASE_NOT_INITIALIZED_MESSAGE);
    });
  });

  describe('getPublicFileUrl', () => {
    it('should return public URL with cache busting', () => {
      const url = storageService['getPublicFileUrl']('user-1/userAvatar.jpg', 'test');

      expect(url).toContain('https://cdn.supabase.com/avatar.jpg');
      expect(url).toMatch(/\?v=\d+/);
    });

    it('should throw error if no public URL', () => {
      const storageService = new StorageService({
        ...userServiceSupabaseMock,
        storage: {
          from: () => ({ getPublicUrl: () => ({ data: {} }) }),
        },
      } as unknown as SupabaseClient);

      expect(() => storageService['getPublicFileUrl']('user-1/userAvatar.jpg', 'test')).toThrow(
        DEFAULT_IMAGE_PUBLIC_URL_FAILED_MESSAGE
      );
    });

    it('should throw error if supabase is not initialized', () => {
      const storageService = new StorageService(undefined);

      expect(() => storageService['getPublicFileUrl']('path', 'test')).toThrow(
        DEFAULT_SUPABASE_NOT_INITIALIZED_MESSAGE
      );
    });
  });

  describe('uploadBufferToSupabase', () => {
    it('should throw error if supabase is not initialized', async () => {
      const storageService = new StorageService(undefined);

      await expect(storageService['uploadBufferToSupabase'](Buffer.from('data'), 'path', 'test')).rejects.toThrow(
        DEFAULT_SUPABASE_NOT_INITIALIZED_MESSAGE
      );
    });

    it('should throw error if upload returns error', async () => {
      (userServiceSupabaseMock.storage.from as jest.Mock).mockReturnValueOnce({
        upload: jest.fn().mockResolvedValue({ error: { message: 'Test Upload failed message' } }),
      });

      await expect(storageService['uploadBufferToSupabase'](Buffer.from('data'), 'path', 'test')).rejects.toThrow(
        'Upload failed: Test Upload failed message'
      );
    });

    it('should succeed when no error', async () => {
      (userServiceSupabaseMock.storage.from as jest.Mock).mockReturnValueOnce({
        upload: jest.fn().mockResolvedValue({ error: null }),
      });

      await expect(
        storageService['uploadBufferToSupabase'](Buffer.from('data'), 'path', 'test')
      ).resolves.toBeUndefined();
    });
  });
});
