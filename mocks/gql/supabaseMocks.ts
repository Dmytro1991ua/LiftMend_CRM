import { SupabaseClient } from '@supabase/supabase-js';

export const authServiceSupabaseMock = {
  auth: {
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    signInWithOAuth: jest.fn(),
    signOut: jest.fn(),
    resetPasswordForEmail: jest.fn(),
    updateUser: jest.fn(),
  },
} as unknown as SupabaseClient;

export const userServiceSupabaseMock = {
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
