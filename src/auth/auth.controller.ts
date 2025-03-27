import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  Session,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse as SwaggerResponse,
  ApiTags,
  ApiBody,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { User } from './types/user.type';
import { SessionData } from './types/session.type';
import { AuthGuard } from './guards/auth.guard';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import type { Request as ExpressRequest, Response } from 'express';

interface RequestWithUser extends ExpressRequest {
  user?: User;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in with email and password' })
  @ApiBody({ type: LoginDto })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'Login successful',
  })
  @SwaggerResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  async login(
    @Body() { email, password }: LoginDto,
    @Session() session: SessionData,
  ): Promise<boolean> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    session.user = user;
    return true;
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiBody({ type: RegisterDto })
  @SwaggerResponse({
    status: HttpStatus.CREATED,
    description: 'User registered successfully',
  })
  @SwaggerResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input or email already exists',
  })
  async register(
    @Body() { email, password, name }: RegisterDto,
    @Session() session: SessionData,
  ): Promise<{ user: User }> {
    const user = await this.authService.register(email, password, name);
    session.user = user;
    return { user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Log out current user' })
  @ApiCookieAuth()
  @SwaggerResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Logged out successfully',
  })
  @SwaggerResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Not authenticated',
  })
  async logout(@Session() session: SessionData): Promise<void> {
    await session.destroy();
  }

  @Get('check-session')
  @ApiOperation({ summary: 'Check if user is authenticated' })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'User is authenticated',
  })
  @SwaggerResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not authenticated',
  })
  checkSession(@Session() session: SessionData): boolean {
    return !!session.user;
  }

  @Get('github')
  @UseGuards(PassportAuthGuard('github'))
  @ApiOperation({ summary: 'Authenticate with GitHub' })
  @SwaggerResponse({
    status: HttpStatus.FOUND,
    description: 'Redirects to GitHub OAuth page',
  })
  githubAuth(): void {
    // This route will redirect to GitHub
    return;
  }

  @Get('google')
  @UseGuards(PassportAuthGuard('google'))
  @ApiOperation({ summary: 'Authenticate with Google' })
  @SwaggerResponse({
    status: HttpStatus.FOUND,
    description: 'Redirects to Google OAuth page',
  })
  googleAuth(): void {
    // This route will redirect to Google
    return;
  }

  @Get('github/callback')
  @UseGuards(PassportAuthGuard('github'))
  @ApiOperation({ summary: 'GitHub OAuth callback' })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'GitHub authentication successful',
  })
  @SwaggerResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'GitHub authentication failed',
  })
  async githubAuthCallback(
    @Req() req: RequestWithUser,
    @Res() res: Response,
    @Session() session: SessionData,
  ): Promise<void> {
    if (!req.user) {
      throw new UnauthorizedException('GitHub authentication failed');
    }

    // Set the authenticated user in session
    session.user = req.user;

    // Redirect to frontend after successful authentication
    await new Promise<void>(resolve => {
      res.redirect(process.env.FRONTEND_URL || '/');
      resolve();
    });
  }

  @Get('google/callback')
  @UseGuards(PassportAuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'Google authentication successful',
  })
  @SwaggerResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Google authentication failed',
  })
  async googleAuthCallback(
    @Req() req: RequestWithUser,
    @Res() res: Response,
    @Session() session: SessionData,
  ): Promise<void> {
    if (!req.user) {
      throw new UnauthorizedException('Google authentication failed');
    }

    // Set the authenticated user in session
    session.user = req.user;

    // Redirect to frontend after successful authentication
    await new Promise<void>(resolve => {
      res.redirect(process.env.FRONTEND_URL || '/');
      resolve();
    });
  }
}
