// src/modules/ingestion/ingestion.scheduler.ts
import { Injectable, OnModuleInit } from "@nestjs/common"
import { IngestionService } from "./ingestion.service"

@Injectable()
export class IngestionScheduler implements OnModuleInit {
  constructor(private ingestionService: IngestionService) {}

  onModuleInit() {
    this.start()
  }

  private start() {
    setInterval(() => {
      this.ingestionService.process().catch((err) => {
        console.error("IngestionScheduler error:", err)
      })
    }, 5 * 60 * 1000)
  }
}