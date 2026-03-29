// src/modules/claims/claims.repository.ts

import { Injectable } from "@nestjs/common"
import { PgService } from "../../database/pg.service"

@Injectable()
export class ClaimsRepository {
  constructor(private pg: PgService) {}

  async findWorkersByZone(zoneId: string) {
    return this.pg.query(
      `
      SELECT id, avg_hourly_income
      FROM workers
      WHERE primary_zone_id = $1
      `,
      [zoneId]
    )
  }

  async findActivePolicy(workerId: string) {
    const rows = await this.pg.query(
      `
      SELECT id
      FROM policies
      WHERE worker_id = $1
      AND status = 'active'
      AND NOW() BETWEEN start_date AND end_date
      `,
      [workerId]
    )

    return rows[0] || null
  }

  async createClaim(data: {
    id: string
    worker_id: string
    policy_id: string
    disruption_id: string
    payout_amount: number
  }) {
    await this.pg.query(
      `
      INSERT INTO claims (
        id,
        worker_id,
        policy_id,
        disruption_id,
        payout_amount,
        claim_type,
        status
      )
      VALUES ($1, $2, $3, $4, $5, 'automatic', 'pending')
      ON CONFLICT (worker_id, disruption_id) DO NOTHING
      `,
      [
        data.id,
        data.worker_id,
        data.policy_id,
        data.disruption_id,
        data.payout_amount,
      ]
    )
  }
}