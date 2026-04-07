import { PrismaClient } from '@prisma/client';
import { SupabaseClient } from '@supabase/supabase-js';
import { GraphQLError } from 'graphql';
import { isNull as _isNull, omitBy as _omitBy } from 'lodash';

import {
  AppUser,
  UploadProfilePicturePayload,
  UserFilter,
  UserProfileInput,
} from '@/graphql/types/server/generated_types';
import { supabaseServiceRole } from '@/lib/supabase-service-role';

import { convertStreamToBuffer, fetchFormDropdownData, getSortedFormDropdownData } from '../utils/utils';

import { DEFAULT_SUPABASE_NOT_INITIALIZED_MESSAGE, DEFAULT_USER_NOT_FOUND_MESSAGE } from './constants';
import StorageService from './StorageService';
import { GraphQLUploadFile } from './types';

class UserService {
  private prisma;
  private supabase;
  private supabaseAdmin;
  private storageService;

  constructor(prisma: PrismaClient, supabase?: SupabaseClient) {
    this.prisma = prisma;
    this.supabase = supabase;
    this.supabaseAdmin = supabaseServiceRole;
    this.storageService = new StorageService(supabase);
  }

  async uploadProfilePicture(file: GraphQLUploadFile): Promise<UploadProfilePicturePayload> {
    console.log(file);
    const { createReadStream } = await file;

    const userId = await this.storageService.getAuthenticatedUserId();
    const buffer = await convertStreamToBuffer(createReadStream());

    // Always use a fixed file name so that each upload overwrites the previous one.
    const filePath = `${userId}/userAvatar.jpg`;

    await this.storageService.uploadBufferToSupabase(buffer, filePath, 'profile_pictures');

    const newImageUrl = this.storageService.getPublicFileUrl(filePath, 'profile_pictures');

    await this.updateUserAvatar(userId ?? '', newImageUrl);

    return { id: userId ?? '', avatarUrl: newImageUrl };
  }

  async updateUserProfile(input: UserProfileInput): Promise<AppUser> {
    if (!this.supabase) {
      throw new GraphQLError(DEFAULT_SUPABASE_NOT_INITIALIZED_MESSAGE);
    }
    const { id, password, ...fieldsToUpdate } = input;

    if (password) {
      const { error: authError } = await this.supabase.auth.updateUser({ password });

      if (authError) {
        throw new Error(authError.message);
      }
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: _omitBy(fieldsToUpdate, _isNull),
    });

    return user;
  }

  async user(userId: string): Promise<AppUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new GraphQLError(DEFAULT_USER_NOT_FOUND_MESSAGE);
    }

    return user;
  }

  async userFilterData(): Promise<UserFilter[]> {
    return fetchFormDropdownData(
      () =>
        getSortedFormDropdownData(this.prisma.user, undefined, ({ id, firstName, lastName, email }) => {
          const label = [firstName, lastName].filter(Boolean).join(' ') || email;

          return { value: id, label }; // directly return object
        }),
      'users'
    );
  }

  async removeAccount(userId: string): Promise<void> {
    if (!this.supabase) {
      throw new GraphQLError(DEFAULT_SUPABASE_NOT_INITIALIZED_MESSAGE);
    }

    const { error: supabaseError } = await this.supabaseAdmin.auth.admin.deleteUser(userId, false);

    if (supabaseError) {
      throw new GraphQLError(`Supabase deletion failed: ${supabaseError.message}`);
    }

    await this.prisma.user.delete({
      where: { id: userId },
    });
  }

  // Updates the user's avatar URL in both Supabase Auth and Supabase User table
  private async updateUserAvatar(userId: string, newImageUrl: string): Promise<void> {
    if (!this.supabase) {
      throw new GraphQLError(DEFAULT_SUPABASE_NOT_INITIALIZED_MESSAGE);
    }

    const { error: updateError } = await this.supabase.auth.updateUser({
      data: { avatar_url: newImageUrl, picture: newImageUrl },
    });

    if (updateError) {
      throw new GraphQLError(updateError.message);
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: newImageUrl },
    });
  }
}

export default UserService;
