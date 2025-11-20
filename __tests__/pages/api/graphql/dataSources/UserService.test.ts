import { SupabaseClient } from '@supabase/supabase-js';

import { supabaseServiceRole } from '@/lib/supabase-service-role';
import { userServicePrismaMock } from '@/mocks/gql/prismaMocks';
import { userServiceSupabaseMock } from '@/mocks/gql/supabaseMocks';
import { createMockFile, mockUser } from '@/mocks/userMocks';
import {
  DEFAULT_IMAGE_PUBLIC_URL_FAILED_MESSAGE,
  DEFAULT_SUPABASE_NOT_INITIALIZED_MESSAGE,
  DEFAULT_USER_NOT_AUTHENTICATED_MESSAGE,
  DEFAULT_USER_NOT_FOUND_MESSAGE,
} from '@/pages/api/graphql/dataSources/constants';
import UserService from '@/pages/api/graphql/dataSources/UserService';
import { convertStreamToBuffer } from '@/pages/api/graphql/utils/utils';

jest.mock('@/pages/api/graphql/utils/utils', () => ({
  ...jest.requireActual('@/pages/api/graphql/utils/utils'),
  convertStreamToBuffer: jest.fn(),
}));

jest.mock('@/lib/supabase-service-role', () => ({
  supabaseServiceRole: {
    auth: {
      admin: {
        deleteUser: jest.fn().mockResolvedValue({ error: null }),
      },
    },
  },
}));

describe('UserService', () => {
  const mockFixedTimestamp = 1699999999999;

  beforeEach(() => {
    (convertStreamToBuffer as jest.Mock).mockReturnValue(Buffer.from('file content'));

    jest.spyOn(Date, 'now').mockReturnValue(mockFixedTimestamp);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const userService = new UserService(userServicePrismaMock, userServiceSupabaseMock);

  describe('UserService', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('user', () => {
      it('should return user if found', async () => {
        (userServicePrismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

        const result = await userService.user('test-user-id-1');

        expect(userServicePrismaMock.user.findUnique).toHaveBeenCalledWith({ where: { id: 'test-user-id-1' } });
        expect(result).toEqual(mockUser);
      });

      it('should throw error if user not found', async () => {
        (userServicePrismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);

        await expect(userService.user('test-user-id-2')).rejects.toThrow(DEFAULT_USER_NOT_FOUND_MESSAGE);
      });
    });

    describe('updateUserProfile', () => {
      it('should update password and user data', async () => {
        const mockUpdatedName = 'Mike Smith';
        const mockInput = { id: 'test-user-id-1', password: 'test-password', name: mockUpdatedName };

        (userServiceSupabaseMock.auth.updateUser as jest.Mock).mockResolvedValue({ error: null });

        (userServicePrismaMock.user.update as jest.Mock).mockResolvedValue({ ...mockUser, name: mockUpdatedName });

        const result = await userService.updateUserProfile(mockInput);

        expect(result).toEqual({ ...mockUser, name: mockUpdatedName });
      });

      it('should throw error if Supabase is not initialized', async () => {
        const service = new UserService(userServicePrismaMock, undefined);

        await expect(service.updateUserProfile({ id: 'test-user-id-1' })).rejects.toThrow(
          DEFAULT_SUPABASE_NOT_INITIALIZED_MESSAGE
        );
      });

      it('should throw error if password update fails', async () => {
        (userServiceSupabaseMock.auth.updateUser as jest.Mock).mockResolvedValue({
          error: { message: 'Test Error occurs' },
        });

        await expect(userService.updateUserProfile({ id: 'test-user-id-1', password: 'test' })).rejects.toThrow(
          'Test Error occurs'
        );
      });
    });

    describe('uploadProfilePicture', () => {
      it('should upload file and update avatar URL', async () => {
        (userServiceSupabaseMock.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: mockUser } });
        (userServiceSupabaseMock.auth.updateUser as jest.Mock).mockResolvedValue({ error: null });
        (userServicePrismaMock.user.update as jest.Mock).mockResolvedValue(mockUser);

        const file = createMockFile();

        const result = await userService.uploadProfilePicture(file);

        expect(result).toEqual({
          avatarUrl: `https://cdn.supabase.com/avatar.jpg?v=${mockFixedTimestamp}`,
          id: 'test-user-id-1',
        });
      });
    });

    describe('getAuthenticatedUserId', () => {
      it('should return user ID if authenticated', async () => {
        (userServiceSupabaseMock.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: mockUser } });

        const result = await userService['getAuthenticatedUserId']();

        expect(result).toBe('test-user-id-1');
      });

      it('should throw error if user is not authenticated', async () => {
        (userServiceSupabaseMock.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: null } });

        await expect(userService['getAuthenticatedUserId']()).rejects.toThrow(DEFAULT_USER_NOT_AUTHENTICATED_MESSAGE);
      });

      it('should throw error if supabase is not initialized', async () => {
        const service = new UserService(userServicePrismaMock, undefined);

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
        const userService = new UserService(userServicePrismaMock, {
          ...userServiceSupabaseMock,
          storage: {
            from: () => ({ getPublicUrl: () => ({ data: {} }) }),
          },
        } as unknown as SupabaseClient);

        expect(() => userService['getPublicFileUrl']('user-1/userAvatar.jpg')).toThrow(
          DEFAULT_IMAGE_PUBLIC_URL_FAILED_MESSAGE
        );
      });

      it('should throw error if supabase is not initialized', () => {
        const userService = new UserService(userServicePrismaMock, undefined);

        expect(() => userService['getPublicFileUrl']('path')).toThrow(DEFAULT_SUPABASE_NOT_INITIALIZED_MESSAGE);
      });
    });

    describe('uploadBufferToSupabase', () => {
      it('should throw error if supabase is not initialized', async () => {
        const userService = new UserService(userServicePrismaMock, undefined);

        await expect(userService['uploadBufferToSupabase']('path', Buffer.from('data'))).rejects.toThrow(
          DEFAULT_SUPABASE_NOT_INITIALIZED_MESSAGE
        );
      });

      it('should throw error if upload returns error', async () => {
        (userServiceSupabaseMock.storage.from as jest.Mock).mockReturnValueOnce({
          upload: jest.fn().mockResolvedValue({ error: { message: 'Test Upload failed message' } }),
        });

        await expect(userService['uploadBufferToSupabase']('path', Buffer.from('data'))).rejects.toThrow(
          'Upload failed: Test Upload failed message'
        );
      });

      it('should succeed when no error', async () => {
        (userServiceSupabaseMock.storage.from as jest.Mock).mockReturnValueOnce({
          upload: jest.fn().mockResolvedValue({ error: null }),
        });

        await expect(userService['uploadBufferToSupabase']('path', Buffer.from('data'))).resolves.toBeUndefined();
      });
    });

    describe('updateUserAvatar', () => {
      const userId = 'test-user-id-1';
      const newUrl = 'https://cdn.supabase.com/avatar.jpg';

      it('should throw error if supabase is not initialized', async () => {
        const service = new UserService(userServicePrismaMock, undefined);

        await expect(service['updateUserAvatar'](userId, newUrl)).rejects.toThrow(
          DEFAULT_SUPABASE_NOT_INITIALIZED_MESSAGE
        );
      });

      it('should throw error if supabase.auth.updateUser returns error', async () => {
        (userServiceSupabaseMock.auth.updateUser as jest.Mock).mockResolvedValueOnce({
          error: { message: 'Update failed' },
        });

        await expect(userService['updateUserAvatar'](userId, newUrl)).rejects.toThrow('Update failed');
      });

      it('should update user avatar successfully', async () => {
        (userServiceSupabaseMock.auth.updateUser as jest.Mock).mockResolvedValueOnce({ error: null });
        (userServicePrismaMock.user.update as jest.Mock).mockResolvedValueOnce({ id: userId, avatarUrl: newUrl });

        await expect(userService['updateUserAvatar'](userId, newUrl)).resolves.toBeUndefined();

        expect(userServiceSupabaseMock.auth.updateUser).toHaveBeenCalledWith({
          data: { avatar_url: newUrl, picture: newUrl },
        });
        expect(userServicePrismaMock.user.update).toHaveBeenCalledWith({
          where: { id: userId },
          data: { avatarUrl: newUrl },
        });
      });
    });

    describe('removeAccount', () => {
      const userId = 'test-user-id-2';

      it('should throw error if supabase is not initialized', async () => {
        const service = new UserService(userServicePrismaMock, undefined);

        await expect(service['removeAccount'](userId)).rejects.toThrow(DEFAULT_SUPABASE_NOT_INITIALIZED_MESSAGE);
      });

      it('should delete user in Supabase and Prisma successfully', async () => {
        const service = new UserService(userServicePrismaMock, userServiceSupabaseMock);

        (supabaseServiceRole.auth.admin.deleteUser as jest.Mock).mockResolvedValue({ error: null });
        (userServicePrismaMock.user.delete as jest.Mock).mockResolvedValue({ id: userId });

        await expect(service['removeAccount'](userId)).resolves.toBeUndefined();

        expect(supabaseServiceRole.auth.admin.deleteUser).toHaveBeenCalledWith(userId, false);
        expect(userServicePrismaMock.user.delete).toHaveBeenCalledWith({ where: { id: userId } });
      });

      it('should throw GraphQLError if Supabase deletion fails', async () => {
        const service = new UserService(userServicePrismaMock, userServiceSupabaseMock);

        (supabaseServiceRole.auth.admin.deleteUser as jest.Mock).mockResolvedValue({
          error: { message: 'User not allowed' },
        });

        await expect(service.removeAccount(userId)).rejects.toThrow('Supabase deletion failed: User not allowed');

        expect(supabaseServiceRole.auth.admin.deleteUser).toHaveBeenCalledWith(userId, false);
        expect(userServicePrismaMock.user.delete).not.toHaveBeenCalled();
      });
    });
  });
});
