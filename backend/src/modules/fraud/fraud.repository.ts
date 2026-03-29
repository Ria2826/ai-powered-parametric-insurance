// src/modules/fraud/fraud.repository.ts

import { Injectable } from "@nestjs/common"
import { PgService } from "../../database/pg.service"

@Injectable()
export class FraudRepository {
  constructor(private pg: PgService) {}

  async getClaimById(claimId: string) {
    const rows = await this.pg.query(
      `SELECT * FROM claims WHERE id = $1`,
      [claimId]
    )
    return rows[0] || null
  }

  async insertFraudLog(data: {
    id: string
    worker_id: string
    claim_id: string
    fraud_score: number
    risk_level: string
    reason: string
  }) {
    await this.pg.query(
      `
      INSERT INTO fraud_logs (
        id,
        worker_id,
        claim_id,
        fraud_score,
        risk_level,
        reason
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [
        data.id,
        data.worker_id,
        data.claim_id,
        data.fraud_score,
        data.risk_level,
        data.reason,
      ]
    )
  }

  async approveClaim(claimId: string) {
    await this.pg.query(
      `
      UPDATE claims
      SET status = 'approved', approved_at = NOW()
      WHERE id = $1
      `,
      [claimId]
    )
  }

  async rejectClaim(claimId: string) {
    await this.pg.query(
      `
      UPDATE claims
      SET status = 'rejected', rejected_at = NOW()
      WHERE id = $1
      `,
      [claimId]
    )
  }
}