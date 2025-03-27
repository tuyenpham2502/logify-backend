import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redis: Redis;
  private readonly logger: Logger;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
    });

    this.redis.on('error', err => {
      this.logger.error(`Redis error: ${err}`);
    });

    this.redis.on('connect', () => {});
  }

  getClient(): Redis {
    return this.redis;
  }
}
