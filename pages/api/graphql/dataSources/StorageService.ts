import { SupabaseClient } from '@supabase/supabase-js';
import { GraphQLError } from 'graphql';

import {
  DEFAULT_IMAGE_PUBLIC_URL_FAILED_MESSAGE,
  DEFAULT_SUPABASE_NOT_INITIALIZED_MESSAGE,
  DEFAULT_USER_NOT_AUTHENTICATED_MESSAGE,
} from './constants';

class StorageService {
  private supabase;

  constructor(supabase?: SupabaseClient) {
    this.supabase = supabase;
  }

  async getAuthenticatedUserId(): Promise<string> {
    if (!this.supabase) {
      throw new GraphQLError(DEFAULT_SUPABASE_NOT_INITIALIZED_MESSAGE);
    }

    const {
      data: { user },
    } = await this.supabase.auth.getUser();

    if (!user) {
      throw new GraphQLError(DEFAULT_USER_NOT_AUTHENTICATED_MESSAGE);
    }

    return user.id;
  }

  // Uploads the buffer to Supabase Storage
  async uploadBufferToSupabase(buffer: Buffer, filePath: string, bucketName: string): Promise<void> {
    if (!this.supabase) {
      throw new GraphQLError(DEFAULT_SUPABASE_NOT_INITIALIZED_MESSAGE);
    }

    const { error } = await this.supabase.storage.from(bucketName).upload(filePath, buffer, {
      upsert: true,
    });

    if (error) {
      throw new GraphQLError(`Upload failed: ${error.message}`);
    }
  }

  // Retrieves the public URL for the uploaded file
  getPublicFileUrl(filePath: string, bucketName: string): string {
    if (!this.supabase) {
      throw new GraphQLError(DEFAULT_SUPABASE_NOT_INITIALIZED_MESSAGE);
    }

    const { data: publicUrlData } = this.supabase.storage.from(bucketName).getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      throw new GraphQLError(DEFAULT_IMAGE_PUBLIC_URL_FAILED_MESSAGE);
    }

    // Add cache-busting query parameter (timestamp)
    return `${publicUrlData.publicUrl}?v=${Date.now()}`;
  }
}

export default StorageService;
