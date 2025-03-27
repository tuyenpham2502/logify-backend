import { Injectable } from '@nestjs/common';
import * as session from 'express-session';
import { RedisService } from '../redis/redis.service';
import { RedisStore } from 'connect-redis';

@Injectable()
export class SessionService {
  constructor(private readonly redisService: RedisService) {}

  getSessionConfig(): session.SessionOptions {
    return {
      store: new RedisStore({
        client: this.redisService.getClient(),
        prefix: 'logify:sess:',
      }),
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        sameSite: 'lax',
      },
      name: 'logify.sid',
    };
  }
}
