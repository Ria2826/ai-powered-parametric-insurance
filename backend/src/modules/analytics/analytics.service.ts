// src/modules/analytics/analytics.service.ts

import { Injectable } from "@nestjs/common"
import { PgService } from "../../database/pg.service"

@Injectable()
export class AnalyticsService {
  constructor(private pg: PgService) {}

  async getOverview() {
    const [claims, payments, fraud] = await Promise.all([
      this.pg.query(`SELECT COUNT(*) FROM claims`),
      this.pg.query(`SELECT COUNT(*) FROM payments WHERE payment_status='success'`),
      this.pg.query(`SELECT COUNT(*) FROM fraud_logs WHERE risk_level='high'`),
    ])

    return {
      total_claims: Number(claims[0].count),
      successful_payments: Number(payments[0].count),
      high_risk_claims: Number(fraud[0].count),
    }
  }

  async getPayoutStats() {
    const rows = await this.pg.query(
      `
      SELECT 
        SUM(amount) as total_payout,
        AVG(amount) as avg_payout
      FROM payments
      WHERE payment_status='success'
      `
    )

    return rows[0]
  }

  async getClaimsByStatus() {
    return this.pg.query(
      `
      SELECT status, COUNT(*) 
      FROM claims
      GROUP BY status
      `
    )
  }
}