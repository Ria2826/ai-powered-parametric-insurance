// src/modules/ingestion/ingestion.module.ts
import { Module } from "@nestjs/common"
import { IngestionService } from "./ingestion.service"
import { IngestionScheduler } from "./ingestion.scheduler"
import { WeatherProvider } from "./providers/weather.provider"
import { DisruptionsModule } from "../disruptions/disruptions.module"
import { DatabaseModule } from "src/database/database.module"

@Module({
  imports: [DisruptionsModule, DatabaseModule],
  providers: [IngestionService, IngestionScheduler, WeatherProvider],
})
export class IngestionModule {}