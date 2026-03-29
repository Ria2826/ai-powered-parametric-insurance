// src/modules/analytics/analytics.controller.ts

import { Controller, Get } from "@nestjs/common"
import { AnalyticsService } from "./analytics.service"

@Controller("analytics")
export class AnalyticsController {
  constructor(private service: AnalyticsService) {}

  @Get("overview")
  async overview() {
    return this.service.getOverview()
  }

  @Get("payouts")
  async payouts() {
    return this.service.getPayoutStats()
  }

  @Get("claims-status")
  async claimsStatus() {
    return this.service.getClaimsByStatus()
  }
}