import { PrismaClient } from '@prisma/client';
import { SupabaseClient } from '@supabase/supabase-js';
import { GraphQLError } from 'graphql';
import { isNull as _isNull, omitBy as _omitBy } from 'lodash';

import { AppUser, UploadProfilePicturePayload, UserProfileInput } from '@/graphql/types/server/generated_types';
import { supabaseServiceRole } from '@/lib/supabase-service-role';

import { convertStreamToBuffer } from '../utils/utils';

import {
  DEFAULT_IMAGE_PUBLIC_URL_FAILED_MESSAGE,
  DEFAULT_SUPABASE_NOT_INITIALIZED_MESSAGE,
  DEFAULT_USER_NOT_AUTHENTICATED_MESSAGE,
  DEFAULT_USER_NOT_FOUND_MESSAGE,
} from './constants';

type GraphQLUploadFile = {
  createReadStream: () => NodeJS.ReadableStream;
  filename: string;
  mimetype: string;
  encoding: string;
};

class UserService {
  private prisma;
  private supabase;
  private supabaseAdmin;

  constructor(prisma: PrismaClient, supabase?: SupabaseClient) {
    this.prisma = prisma;
    this.supabase = supabase;
    this.supabaseAdmin = supabaseServiceRole;
  }

  async uploadProfilePicture(file: GraphQLUploadFile): Promise<UploadProfilePicturePayload> {
    const { createReadStream } = await file;

    const userId = await this.getAuthenticatedUserId();
    const buffer = await convertStreamToBuffer(createReadStream());
    // Always use a fixed file name so that each upload overwrites the previous one.
    const filePath = `${userId}/userAvatar.jpg`;

    await this.uploadBufferToSupabase(filePath, buffer);

    const newImageUrl = this.getPublicFileUrl(filePath);

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

  private async getAuthenticatedUserId(): Promise<string | null> {
    if (!this.supabase) {
      throw new GraphQLError(DEFAULT_SUPABASE_NOT_INITIALIZED_MESSAGE);
    }

    const {
      data: { user },
    } = await this.supabase.auth.getUser();

    if (!user) {
      throw new GraphQLError(DEFAULT_USER_NOT_AUTHENTICATED_MESSAGE);
    }

    return user?.id ?? null;
  }

  // Uploads the buffer to Supabase Storage
  private async uploadBufferToSupabase(filePath: string, buffer: Buffer): Promise<void> {
    if (!this.supabase) {
      throw new GraphQLError(DEFAULT_SUPABASE_NOT_INITIALIZED_MESSAGE);
    }

    const { error } = await this.supabase.storage.from('profile_pictures').upload(filePath, buffer, { upsert: true });

    if (error) {
      throw new GraphQLError(`Upload failed: ${error.message}`);
    }
  }

  // Retrieves the public URL for the uploaded file
  private getPublicFileUrl(filePath: string): string {
    if (!this.supabase) {
      throw new GraphQLError(DEFAULT_SUPABASE_NOT_INITIALIZED_MESSAGE);
    }

    const { data: publicUrlData } = this.supabase.storage.from('profile_pictures').getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      throw new GraphQLError(DEFAULT_IMAGE_PUBLIC_URL_FAILED_MESSAGE);
    }

    // Add cache-busting query parameter (timestamp)
    return `${publicUrlData.publicUrl}?v=${Date.now()}`;
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
