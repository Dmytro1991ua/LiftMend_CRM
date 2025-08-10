import { GraphQLError } from 'graphql';

import { CreateUserInput, OAuthProvider, SignInUserInput } from '@/graphql/types/server/generated_types';
import { authServicePrismaMock } from '@/mocks/gql/prismaMocks';
import { authServiceSupabaseMock } from '@/mocks/gql/supabaseMocks';
import { mockSupabaseUser, mockUser } from '@/mocks/userMocks';
import AuthService from '@/pages/api/graphql/dataSources/AuthService';
import {
  DEFAULT_RESET_PASSWORD_MESSAGE,
  DEFAULT_SIGN_IN_MESSAGE,
  DEFAULT_SIGN_UP_MESSAGE,
} from '@/pages/api/graphql/dataSources/constants';

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const authService = new AuthService(authServicePrismaMock, authServiceSupabaseMock);

  describe('signUp', () => {
    const mockInput: CreateUserInput = {
      email: mockUser.email,
      password: 'securepass123',
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      phone: mockUser.phone,
      emailRedirectTo: 'http://localhost/welcome',
    };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should sign up and create user successfully', async () => {
      (authServiceSupabaseMock.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: mockSupabaseUser },
        error: null,
      });

      (authServicePrismaMock.user.create as jest.Mock).mockResolvedValue({ ...mockUser });

      const result = await authService.signUp(mockInput);

      expect(authServiceSupabaseMock.auth.signUp).toHaveBeenCalledWith({
        email: mockInput.email,
        password: mockInput.password,
        options: {
          emailRedirectTo: mockInput.emailRedirectTo,
          data: {
            name: 'Alex Smith',
            email: mockInput.email,
          },
        },
      });
      expect(result).toEqual(mockSupabaseUser);
    });

    it('should throw an error if supabase returns error', async () => {
      (authServiceSupabaseMock.auth.signUp as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Test error' },
      });

      await expect(authService.signUp(mockInput)).rejects.toThrow(new GraphQLError('Test error'));
    });

    it('should throw an error if supabase returns no user', async () => {
      (authServiceSupabaseMock.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      await expect(authService.signUp(mockInput)).rejects.toThrow(new GraphQLError(DEFAULT_SIGN_UP_MESSAGE));
    });
  });

  describe('signIn', () => {
    const mockInput: SignInUserInput = {
      email: mockUser.email,
      password: 'securepass123',
    };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully login and return user', async () => {
      (authServiceSupabaseMock.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await authService.signIn(mockInput);

      expect(authServiceSupabaseMock.auth.signInWithPassword).toHaveBeenCalledWith(mockInput);
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if supabase returns error', async () => {
      (authServiceSupabaseMock.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Test login error' },
      });

      await expect(authService.signIn(mockInput)).rejects.toThrow(new GraphQLError('Test login error'));
    });

    it('should throw an error if supabase returns no user', async () => {
      (authServiceSupabaseMock.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      await expect(authService.signIn(mockInput)).rejects.toThrow(new GraphQLError(DEFAULT_SIGN_IN_MESSAGE));
    });
  });

  describe('signInWithOAuth', () => {
    const mockUrl = 'https://test-url.com';

    beforeEach(() => {
      process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL = mockUrl;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should signIn user with Google provider and return url', async () => {
      (authServiceSupabaseMock.auth.signInWithOAuth as jest.Mock).mockResolvedValue({
        data: { url: mockUrl },
        error: null,
      });

      const result = await authService.signInWithOAuth(OAuthProvider.Google);

      expect(authServiceSupabaseMock.auth.signInWithOAuth).toHaveBeenCalledWith({
        options: { redirectTo: mockUrl },
        provider: 'google',
      });
      expect(result).toEqual(mockUrl);
    });

    it('should throw an error if supabase returns error', async () => {
      (authServiceSupabaseMock.auth.signInWithOAuth as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Test sign in with oauth error' },
      });

      await expect(authService.signInWithOAuth(OAuthProvider.Google)).rejects.toThrow(
        new GraphQLError('Test sign in with oauth error')
      );
    });
  });

  describe('signOut', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully signOut a user and return true', async () => {
      (authServiceSupabaseMock.auth.signOut as jest.Mock).mockResolvedValue({
        error: null,
      });

      const result = await authService.signOut();

      expect(result).toBe(true);
    });

    it('should throw an error if supabase returns error', async () => {
      (authServiceSupabaseMock.auth.signOut as jest.Mock).mockResolvedValue({
        error: { message: 'Test signOut error' },
      });

      await expect(authService.signOut()).rejects.toThrow(new GraphQLError('Test signOut error'));
    });
  });

  describe('forgotPassword', () => {
    const mockInput = {
      email: mockUser.email,
      redirectTo: 'http://localhost/welcome',
    };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully reset password, send email to redirect url a user and return true', async () => {
      (authServiceSupabaseMock.auth.resetPasswordForEmail as jest.Mock).mockResolvedValue({
        error: null,
      });

      const result = await authService.forgotPassword(mockInput.email, mockInput.redirectTo);

      expect(result).toBe(true);
    });

    it('should throw an error if supabase returns error', async () => {
      (authServiceSupabaseMock.auth.resetPasswordForEmail as jest.Mock).mockResolvedValue({
        error: { message: 'Test forgot password error' },
      });

      await expect(authService.forgotPassword(mockInput.email, mockInput.redirectTo)).rejects.toThrow(
        new GraphQLError('Test forgot password error')
      );
    });
  });

  describe('resetPassword', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should reset password, update user data and return user', async () => {
      (authServiceSupabaseMock.auth.updateUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await authService.resetPassword('test-password');

      expect(authServiceSupabaseMock.auth.updateUser).toHaveBeenCalledWith({ password: 'test-password' });
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if supabase returns error', async () => {
      (authServiceSupabaseMock.auth.updateUser as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Test reset password error' },
      });

      await expect(authService.resetPassword('test-password')).rejects.toThrow(
        new GraphQLError('Test reset password error')
      );
    });

    it('should throw an error if supabase returns no user', async () => {
      (authServiceSupabaseMock.auth.updateUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      await expect(authService.resetPassword('test-password')).rejects.toThrow(
        new GraphQLError(DEFAULT_RESET_PASSWORD_MESSAGE)
      );
    });
  });
});
