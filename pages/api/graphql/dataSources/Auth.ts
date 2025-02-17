import { PrismaClient } from '@prisma/client';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { GraphQLError } from 'graphql';

import {  CreateUserInput } from '@/graphql/types/server/generated_types';

class AuthService {
  private prisma;
  private supabase;

  constructor(prisma: PrismaClient, supabase?: SupabaseClient) {
    this.prisma = prisma;
    this.supabase = supabase;
  }

  async signUp(input: CreateUserInput): Promise<User> {
    const { email, password, firstName, phone, lastName, redirectTo } = input;

    const response = await this.supabase?.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (response?.error) throw new GraphQLError(response.error.message);

    const user = response?.data?.user;

    if (!user) throw new GraphQLError('User signup failed');

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
}

export default AuthService;
