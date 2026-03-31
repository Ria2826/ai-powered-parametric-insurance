// src/modules/fraud/fraud.module.ts

import { EventsModule } from '../../events/events.module';

import { Module } from "@nestjs/common"
import { FraudService } from "./fraud.service"
import { FraudRepository } from "./fraud.repository"
import { FraudConsumer } from "./fraud.consumer"
import { DatabaseModule } from "../../database/database.module"
import { RedisModule } from "../../redis/redis.module"

@Module({
  imports: [DatabaseModule, RedisModule, EventsModule],
  providers: [FraudService, FraudRepository, FraudConsumer],
})
export class FraudModule {}