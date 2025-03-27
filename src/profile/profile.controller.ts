import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  UseGuards,
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User as DbUser } from '@prisma/client';
import { Request } from 'express';
import { SessionData } from '../auth/types/session.type';
import { User } from '../auth/types/user.type';

type SafeUser = Omit<DbUser, 'password' | 'accessToken' | 'refreshToken'>;
type RequestWithSession = Request & { session: SessionData };

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<RequestWithSession>();
    const user = request.session.user;

    if (!user) {
      throw new UnauthorizedException('User not found in session');
    }

    return user;
  },
);

@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfile(@CurrentUser() user: User): Promise<SafeUser> {
    const profile = await this.profileService.getUserProfile(user.id);
    return profile;
  }

  @Put()
  async updateProfile(
    @CurrentUser() user: User,
    @Body()
    data: {
      name?: string;
      avatarUrl?: string;
      email?: string;
    },
  ): Promise<SafeUser> {
    const updatedProfile = await this.profileService.updateProfile(
      user.id,
      data,
    );
    return updatedProfile;
  }

  @Put('oauth')
  async updateOAuthInfo(
    @CurrentUser() user: User,
    @Body()
    data: {
      githubId?: string;
      googleId?: string;
      accessToken?: string;
      refreshToken?: string;
      avatarUrl?: string;
    },
  ): Promise<SafeUser> {
    const updatedProfile = await this.profileService.updateOAuthInfo(
      user.id,
      data,
    );
    return updatedProfile;
  }

  @Delete()
  async deleteProfile(@CurrentUser() user: User): Promise<void> {
    await this.profileService.deleteProfile(user.id);
  }
}
