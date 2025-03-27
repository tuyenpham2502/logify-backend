/* eslint-disable @typescript-eslint/no-misused-promises */

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { User as PrismaUser } from '@prisma/client';
import type { GitHubUser } from './types/github.type';
import type { GoogleUser } from './types/google.type';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser: PrismaUser = {
    id: 'test-uuid',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword123',
    githubId: null,
    googleId: null,
    accessToken: null,
    refreshToken: null,
    avatarUrl: null,
    isEmailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(true));
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(() => Promise.resolve('hashedpassword123'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: pass, ...userWithoutPassword } = mockUser;

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.validateUser(email, password);

      expect(result).toEqual(userWithoutPassword);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('should return null when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.validateUser(
        'nonexistent@example.com',
        'password123',
      );

      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      const result = await service.validateUser(
        'test@example.com',
        'wrongpassword',
      );

      expect(result).toBeNull();
    });
  });

  describe('register', () => {
    it('should create a new user when email does not exist', async () => {
      const email = 'new@example.com';
      const password = 'password123';
      const name = 'New User';
      const hashedPassword = 'hashedpassword123';

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        ...mockUser,
        email,
        name,
        password: hashedPassword,
      });

      const result = await service.register(email, password, name);

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });
      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe(email);
      expect(result.name).toBe(name);
    });

    it('should throw UnauthorizedException when email already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.register('test@example.com', 'password123', 'Test User'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateGitHubUser', () => {
    const githubUser: GitHubUser = {
      githubId: 'github123',
      email: 'github@example.com',
      name: 'GitHub User',
      avatarUrl: 'https://github.com/avatar.jpg',
      accessToken: 'token123',
      refreshToken: 'refresh123',
    };

    it('should return existing user when GitHub ID matches', async () => {
      const existingUser = {
        ...mockUser,
        githubId: githubUser.githubId,
        email: githubUser.email as string,
      };
      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);

      const result = (await service.validateGitHubUser(
        githubUser,
      )) as PrismaUser;

      expect(result).not.toHaveProperty('password');
      expect(result.githubId).toBe(githubUser.githubId);
    });

    it('should update existing user with GitHub info when email matches', async () => {
      const updatedUser = {
        ...mockUser,
        githubId: githubUser.githubId,
        avatarUrl: githubUser.avatarUrl,
      };

      mockPrismaService.user.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          ...mockUser,
          email: githubUser.email,
        });
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = (await service.validateGitHubUser(
        githubUser,
      )) as PrismaUser;

      expect(mockPrismaService.user.update).toHaveBeenCalled();
      expect(result.githubId).toBe(githubUser.githubId);
      expect(result.avatarUrl).toBe(githubUser.avatarUrl);
    });

    it('should throw UnauthorizedException when GitHub email is missing', async () => {
      mockPrismaService.user.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      await expect(
        service.validateGitHubUser({
          ...githubUser,
          email: undefined,
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateGoogleUser', () => {
    const googleUser: GoogleUser = {
      googleId: 'google123',
      email: 'google@example.com',
      name: 'Google User',
      avatarUrl: 'https://google.com/avatar.jpg',
      accessToken: 'token123',
      refreshToken: 'refresh123',
    };

    it('should return existing user when Google ID matches', async () => {
      const existingUser = {
        ...mockUser,
        googleId: googleUser.googleId,
        email: googleUser.email,
        name: googleUser.name,
        avatarUrl: googleUser.avatarUrl,
        accessToken: googleUser.accessToken,
        refreshToken: googleUser.refreshToken,
      };
      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);

      const result = (await service.validateGoogleUser(
        googleUser,
      )) as PrismaUser;

      expect(result).not.toHaveProperty('password');
      expect(result).toEqual(result);
    });

    it('should update existing user with Google info when email matches', async () => {
      const updatedUser = {
        ...mockUser,
        googleId: googleUser.googleId,
        avatarUrl: googleUser.avatarUrl,
      };

      mockPrismaService.user.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          ...mockUser,
          email: googleUser.email,
        });
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = (await service.validateGoogleUser(
        googleUser,
      )) as PrismaUser;

      expect(mockPrismaService.user.update).toHaveBeenCalled();
      expect(result.googleId).toBe(googleUser.googleId);
      expect(result.avatarUrl).toBe(googleUser.avatarUrl);
    });

    it('should throw UnauthorizedException when Google email is missing', async () => {
      mockPrismaService.user.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      await expect(
        service.validateGoogleUser({
          ...googleUser,
          email: undefined as unknown as string,
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
