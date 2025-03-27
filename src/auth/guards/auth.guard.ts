import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { SessionData } from '../types/session.type';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { session: SessionData }>();

    if (!request.session.user) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    return true;
  }
}
