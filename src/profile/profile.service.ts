import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

type SafeUser = Omit<User, 'password' | 'accessToken' | 'refreshToken'>;

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  private stripSensitiveData(user: User): SafeUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, accessToken, refreshToken, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId: string): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.stripSensitiveData(user);
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    data: {
      name?: string;
      avatarUrl?: string;
      email?: string;
    },
  ): Promise<SafeUser> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
    });

    return this.stripSensitiveData(user);
  }

  /**
   * Update OAuth information
   */
  async updateOAuthInfo(
    userId: string,
    data: {
      githubId?: string;
      googleId?: string;
      accessToken?: string;
      refreshToken?: string;
      avatarUrl?: string;
    },
  ): Promise<SafeUser> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
    });

    return this.stripSensitiveData(user);
  }

  /**
   * Delete user profile
   */
  async deleteProfile(userId: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
