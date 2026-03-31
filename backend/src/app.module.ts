// src/app.module.ts
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from "@nestjs/core"
import { AuthGuard } from "./common/guards/auth.guard"
import { DatabaseModule } from './database/database.module'
import { AuthModule } from './modules/auth/auth.module'
import { RedisModule } from "./redis/redis.module"
import { WorkersModule } from './modules/workers/workers.module'
import { PoliciesModule } from "./modules/policies/policies.module"
import { DisruptionsModule } from "./modules/disruptions/disruptions.module"
import { ClaimsModule } from "./modules/claims/claims.module"
import { FraudModule } from "./modules/fraud/fraud.module"
import { PaymentsModule } from "./modules/payments/payments.module"
import { AnalyticsModule } from "./modules/analytics/analytics.module"
import { IngestionModule } from "./modules/ingestion/ingestion.module"
import { EventsModule } from "./events/events.module"

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    RedisModule,
    AuthModule,
    WorkersModule,
    PoliciesModule,
    DisruptionsModule,
    ClaimsModule,
    FraudModule,
    PaymentsModule,
    AnalyticsModule,
    IngestionModule,
    EventsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}