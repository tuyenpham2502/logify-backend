/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from './types/user.type';
import { GitHubUser } from './types/github.type';
import { GoogleUser } from './types/google.type';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user?.password && (await bcrypt.compare(password, user.password))) {
      const { password: _pass, ...result } = user;
      return result;
    }
    return null;
  }

  async register(
    email: string,
    password: string,
    name?: string,
  ): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const { password: _pass, ...result } = user;
    return result;
  }

  async validateGitHubUser(githubUser: GitHubUser): Promise<User> {
    // First try to find user by GitHub ID
    let user = await this.prisma.user.findUnique({
      where: { githubId: githubUser.githubId },
    });

    if (!user && githubUser.email) {
      // If user not found by GitHub ID but email exists, try to find by email
      user = await this.prisma.user.findUnique({
        where: { email: githubUser.email },
      });

      if (user) {
        // If user exists with email but no GitHub ID, update with GitHub info
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            githubId: githubUser.githubId,
            avatarUrl: githubUser.avatarUrl || null,
          },
        });
      }
    }

    if (!user) {
      // If no user found and email exists, create a new one
      if (!githubUser.email) {
        throw new UnauthorizedException('GitHub email is required');
      }

      user = await this.prisma.user.create({
        data: {
          email: githubUser.email,
          name: githubUser.name || null,
          githubId: githubUser.githubId,
          avatarUrl: githubUser.avatarUrl || null,
        },
      });
    }

    // Remove sensitive data
    const { password: _pass, ...result } = user;
    return result;
  }

  async validateGoogleUser(googleUser: GoogleUser): Promise<User> {
    // First try to find user by Google ID
    let user = await this.prisma.user.findUnique({
      where: { googleId: googleUser.googleId },
    });

    if (!user && googleUser.email) {
      // If user not found by Google ID but email exists, try to find by email
      user = await this.prisma.user.findUnique({
        where: { email: googleUser.email },
      });

      if (user) {
        // If user exists with email but no Google ID, update with Google info
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: googleUser.googleId,
            avatarUrl: googleUser.avatarUrl || null,
          },
        });
      }
    }

    if (!user) {
      // If no user found and email exists, create a new one
      if (!googleUser.email) {
        throw new UnauthorizedException('Google email is required');
      }

      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name || null,
          googleId: googleUser.googleId,
          avatarUrl: googleUser.avatarUrl || null,
        },
      });
    }

    // Remove sensitive data
    const { password: _pass, ...result } = user;
    return result;
  }
}
