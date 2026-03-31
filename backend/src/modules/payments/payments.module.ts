// src/modules/payments/payments.module.ts

import { EventsModule } from '../../events/events.module';

import { Module } from "@nestjs/common"
import { PaymentsService } from "./payments.service"
import { PaymentsRepository } from "./payments.repository"
import { PaymentsConsumer } from "./payments.consumer"
import { DatabaseModule } from "../../database/database.module"
import { RedisModule } from "../../redis/redis.module"

@Module({
  imports: [DatabaseModule, RedisModule, EventsModule],
  providers: [PaymentsService, PaymentsRepository, PaymentsConsumer],
})
export class PaymentsModule {}