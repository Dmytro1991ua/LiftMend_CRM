import { PrismaClient } from '@prisma/client';
import { SupabaseClient } from '@supabase/supabase-js';

import { mockUser } from '@/mocks/userMocks';
import {
  DEFAULT_IMAGE_PUBLIC_URL_FAILED_MESSAGE,
  DEFAULT_SUPABASE_NOT_INITIALIZED_MESSAGE,
  DEFAULT_USER_NOT_AUTHENTICATED_MESSAGE,
  DEFAULT_USER_NOT_FOUND_MESSAGE,
} from '@/pages/api/graphql/dataSources/constants';
import UserService from '@/pages/api/graphql/dataSources/UserService';
import { convertStreamToBuffer } from '@/pages/api/graphql/utils';

jest.mock('@/pages/api/graphql/utils', () => ({
  ...jest.requireActual('@/pages/api/graphql/utils'),
  convertStreamToBuffer: jest.fn(),
}));

describe('UserService', () => {
  const prismaMock = {
    user: {
      update: jest.fn(),
      findUnique: jest.fn(),
    },
    storage: {
      from: jest.fn(),
    },
  } as unknown as PrismaClient;

  const supabaseMock = {
    auth: {
      updateUser: jest.fn(),
      getUser: jest.fn(),
    },
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn().mockResolvedValue({ error: null }),
        getPublicUrl: jest.fn(() => ({ data: { publicUrl: 'https://cdn.supabase.com/avatar.jpg' } })),
      })),
    },
  } as unknown as SupabaseClient;

  const mockFixedTimestamp = 1699999999999;

  beforeEach(() => {
    (convertStreamToBuffer as jest.Mock).mockReturnValue(Buffer.from('file content'));

    jest.spyOn(Date, 'now').mockReturnValue(mockFixedTimestamp);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const userService = new UserService(prismaMock, supabaseMock);

  describe('UserService', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('user', () => {
      it('should return user if found', async () => {
        (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

        const result = await userService.user('test-user-id-1');

        expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { id: 'test-user-id-1' } });
        expect(result).toEqual(mockUser);
      });

      it('should throw error if user not found', async () => {
        (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);

        await expect(userService.user('test-user-id-2')).rejects.toThrow(DEFAULT_USER_NOT_FOUND_MESSAGE);
      });
    });

    describe('updateUserProfile', () => {
      it('should update password and user data', async () => {
        const mockUpdatedName = 'Mike Smith';
        const mockInput = { id: 'test-user-id-1', password: 'test-password', name: mockUpdatedName };

        (supabaseMock.auth.updateUser as jest.Mock).mockResolvedValue({ error: null });

        (prismaMock.user.update as jest.Mock).mockResolvedValue({ ...mockUser, name: mockUpdatedName });

        const result = await userService.updateUserProfile(mockInput);

        expect(result).toEqual({ ...mockUser, name: mockUpdatedName });
      });

      it('should throw error if Supabase is not initialized', async () => {
        const service = new UserService(prismaMock, undefined);

        await expect(service.updateUserProfile({ id: 'test-user-id-1' })).rejects.toThrow(
          DEFAULT_SUPABASE_NOT_INITIALIZED_MESSAGE
        );
      });

      it('should throw error if password update fails', async () => {
        (supabaseMock.auth.updateUser as jest.Mock).mockResolvedValue({ error: { message: 'Test Error occurs' } });

        await expect(userService.updateUserProfile({ id: 'test-user-id-1', password: 'test' })).rejects.toThrow(
          'Test Error occurs'
        );
      });
    });

    describe('uploadProfilePicture', () => {
      it('should upload file and update avatar URL', async () => {
        (supabaseMock.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: mockUser } });
        (supabaseMock.auth.updateUser as jest.Mock).mockResolvedValue({ error: null });
        (prismaMock.user.update as jest.Mock).mockResolvedValue(mockUser);

        const file = { createReadStream: () => ({ on: jest.fn(), pipe: jest.fn() }) };
        const result = await userService.uploadProfilePicture(file as any);

        expect(result).toEqual({
          avatarUrl: `https://cdn.supabase.com/avatar.jpg?v=${mockFixedTimestamp}`,
          id: 'test-user-id-1',
        });
      });
    });

    describe('getAuthenticatedUserId', () => {
      it('should return user ID if authenticated', async () => {
        (supabaseMock.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: mockUser } });

        const result = await userService['getAuthenticatedUserId']();

        expect(result).toBe('test-user-id-1');
      });

      it('should throw error if user is not authenticated', async () => {
        (supabaseMock.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: null } });

        await expect(userService['getAuthenticatedUserId']()).rejects.toThrow(DEFAULT_USER_NOT_AUTHENTICATED_MESSAGE);
      });

      it('should throw error if supabase is not initialized', async () => {
        const service = new UserService(prismaMock, undefined);

        await expect(service['getAuthenticatedUserId']()).rejects.toThrow(DEFAULT_SUPABASE_NOT_INITIALIZED_MESSAGE);
      });
    });

    describe('getPublicFileUrl', () => {
      it('should return public URL with cache busting', () => {
        const url = userService['getPublicFileUrl']('user-1/userAvatar.jpg');

        expect(url).toContain('https://cdn.supabase.com/avatar.jpg');
        expect(url).toMatch(/\?v=\d+/);
      });

      it('should throw error if no public URL', () => {
        const userService = new UserService(prismaMock, {
          ...supabaseMock,
          storage: {
            from: () => ({ getPublicUrl: () => ({ data: {} }) }),
          },
        } as unknown as SupabaseClient);

        expect(() => userService['getPublicFileUrl']('user-1/userAvatar.jpg')).toThrow(
          DEFAULT_IMAGE_PUBLIC_URL_FAILED_MESSAGE
        );
      });

      it('should throw error if supabase is not initialized', () => {
        const userService = new UserService(prismaMock, undefined);

        expect(() => userService['getPublicFileUrl']('path')).toThrow(DEFAULT_SUPABASE_NOT_INITIALIZED_MESSAGE);
      });
    });

    describe('uploadBufferToSupabase', () => {
      it('should throw error if supabase is not initialized', async () => {
        const userService = new UserService(prismaMock, undefined);

        await expect(userService['uploadBufferToSupabase']('path', Buffer.from('data'))).rejects.toThrow(
          DEFAULT_SUPABASE_NOT_INITIALIZED_MESSAGE
        );
      });

      it('should throw error if upload returns error', async () => {
        (supabaseMock.storage.from as jest.Mock).mockReturnValueOnce({
          upload: jest.fn().mockResolvedValue({ error: { message: 'Test Upload failed message' } }),
        });

        await expect(userService['uploadBufferToSupabase']('path', Buffer.from('data'))).rejects.toThrow(
          'Upload failed: Test Upload failed message'
        );
      });

      it('should succeed when no error', async () => {
        (supabaseMock.storage.from as jest.Mock).mockReturnValueOnce({
          upload: jest.fn().mockResolvedValue({ error: null }),
        });

        await expect(userService['uploadBufferToSupabase']('path', Buffer.from('data'))).resolves.toBeUndefined();
      });
    });

    describe('updateUserAvatar', () => {
      const userId = 'test-user-id-1';
      const newUrl = 'https://cdn.supabase.com/avatar.jpg';

      it('should throw error if supabase is not initialized', async () => {
        const service = new UserService(prismaMock, undefined);

        await expect(service['updateUserAvatar'](userId, newUrl)).rejects.toThrow(
          DEFAULT_SUPABASE_NOT_INITIALIZED_MESSAGE
        );
      });

      it('should throw error if supabase.auth.updateUser returns error', async () => {
        (supabaseMock.auth.updateUser as jest.Mock).mockResolvedValueOnce({ error: { message: 'Update failed' } });

        await expect(userService['updateUserAvatar'](userId, newUrl)).rejects.toThrow('Update failed');
      });

      it('should update user avatar successfully', async () => {
        (supabaseMock.auth.updateUser as jest.Mock).mockResolvedValueOnce({ error: null });
        (prismaMock.user.update as jest.Mock).mockResolvedValueOnce({ id: userId, avatarUrl: newUrl });

        await expect(userService['updateUserAvatar'](userId, newUrl)).resolves.toBeUndefined();

        expect(supabaseMock.auth.updateUser).toHaveBeenCalledWith({
          data: { avatar_url: newUrl, picture: newUrl },
        });
        expect(prismaMock.user.update).toHaveBeenCalledWith({
          where: { id: userId },
          data: { avatarUrl: newUrl },
        });
      });
    });
  });
});
