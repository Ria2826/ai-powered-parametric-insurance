// src/events/event.publisher.ts
import { Injectable } from "@nestjs/common"
import { v4 as uuid } from "uuid"
import { RedisService } from "../redis/redis.service"
import { EventType } from "./event.constants"
import { EventEnvelope } from "./event.types"

@Injectable()
export class EventPublisher {
  constructor(private redis: RedisService) {}

  async publish<T>(
    stream: string,
    eventType: EventType,
    producer: string,
    payload: T
  ): Promise<EventEnvelope<T>> {
    const event: EventEnvelope<T> = {
      event_id: uuid(),
      event_version: 1,
      event_type: eventType,
      timestamp: new Date().toISOString(),
      producer,
      payload,
    }

    await this.redis.publish(stream, event)

    return event
  }
}