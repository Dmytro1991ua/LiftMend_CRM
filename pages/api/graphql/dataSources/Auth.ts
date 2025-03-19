import { PrismaClient } from '@prisma/client';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { GraphQLError } from 'graphql';

import { AppUser, CreateUserInput, SignInUserInput } from '@/graphql/types/server/generated_types';

import {
  DEFAULT_IMAGE_PUBLIC_URL_FAILED_MESSAGE,
  DEFAULT_SIGN_IN_MESSAGE,
  DEFAULT_SIGN_UP_MESSAGE,
  DEFAULT_SUPABASE_NOT_INITIALIZED_MESSAGE,
  DEFAULT_USER_NOT_AUTHENTICATED_MESSAGE,
  DEFAULT_USER_NOT_FOUND_MESSAGE,
} from './constants';
import { convertStreamToBuffer } from './utils';

interface GraphQLUploadFile {
  createReadStream: () => NodeJS.ReadableStream;
  filename: string;
  mimetype: string;
  encoding: string;
}

class AuthService {
  private prisma;
  private supabase;

  constructor(prisma: PrismaClient, supabase?: SupabaseClient) {
    this.prisma = prisma;
    this.supabase = supabase;
  }

  async signUp(input: CreateUserInput): Promise<User> {
    const { email, password, firstName, phone, lastName, emailRedirectTo } = input;

    const response = await this.supabase?.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: emailRedirectTo ?? '',
      },
    });

    if (response?.error) throw new GraphQLError(response.error.message);

    const user = response?.data?.user;

    if (!user) throw new GraphQLError(DEFAULT_SIGN_UP_MESSAGE);

    await this.prisma.user.create({
      data: {
        id: response?.data?.user?.id,
        email: response?.data?.user?.email ?? '',
        firstName,
        lastName,
        phone,
        createdAt: new Date(),
      },
    });

    return user;
  }

  async signIn(input: SignInUserInput): Promise<User> {
    const { email, password } = input;

    const response = await this.supabase?.auth.signInWithPassword({
      email,
      password,
    });

    if (response?.error) throw new GraphQLError(response.error.message);

    const user = response?.data?.user;

    if (!user) throw new GraphQLError(DEFAULT_SIGN_IN_MESSAGE);

    return response?.data?.user;
  }

  async signOut(): Promise<boolean> {
    const response = await this.supabase?.auth.signOut();

    if (response?.error) throw new GraphQLError(response.error.message);

    return true;
  }

  async uploadProfilePicture(file: GraphQLUploadFile): Promise<string> {
    const { createReadStream } = await file;

    const userId = await this.getAuthenticatedUserId();
    const buffer = await convertStreamToBuffer(createReadStream());
    // Always use a fixed file name so that each upload overwrites the previous one.
    const filePath = `${userId}/userAvatar.jpg`;

    await this.uploadBufferToSupabase(filePath, buffer);

    const newImageUrl = this.getPublicFileUrl(filePath);

    await this.updateUserAvatar(userId ?? '', newImageUrl);

    return newImageUrl;
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

export default AuthService;
