// src/events/events.module.ts
import { Module } from "@nestjs/common"
import { EventPublisher } from "./event.publisher"
import { RedisModule } from "../redis/redis.module"

@Module({
  imports: [RedisModule],
  providers: [EventPublisher],
  exports: [EventPublisher],
})
export class EventsModule {}