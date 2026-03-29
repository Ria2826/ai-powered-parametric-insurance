// src/redis/redis.service.ts

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import Redis from 'ioredis'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis

  onModuleInit() {
    this.client = new Redis(process.env.REDIS_URL!)

    this.client.ping()
      .then(() => console.log('Redis connected'))
      .catch((err) => {
        console.error('Redis connection failed', err)
        process.exit(1)
      })
  }

  getClient(): Redis {
    return this.client
  }

  async publish(stream: string, event: any) {
    await this.client.xadd(
      stream,
      '*',
      'event',
      JSON.stringify(event),
    )
  }

  async acknowledge(stream: string, group: string, id: string) {
    await this.client.xack(stream, group, id)
  }

  async onModuleDestroy() {
    await this.client.quit()
  }
}