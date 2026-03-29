// src/modules/claims/claims.module.ts

import { Module } from "@nestjs/common"
import { ClaimsService } from "./claims.service"
import { ClaimsRepository } from "./claims.repository"
import { ClaimsConsumer } from "./claims.consumer"
import { DatabaseModule } from "../../database/database.module"
import { RedisModule } from "../../redis/redis.module"

@Module({
  imports: [DatabaseModule, RedisModule],
  providers: [ClaimsService, ClaimsRepository, ClaimsConsumer],
})
export class ClaimsModule {}