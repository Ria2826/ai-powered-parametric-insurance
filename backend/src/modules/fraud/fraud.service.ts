// src/modules/fraud/fraud.service.ts

import { Injectable } from "@nestjs/common"
import { FraudRepository } from "./fraud.repository"
import { v4 as uuid } from "uuid"
import { EventPublisher } from "../../events/event.publisher"
import { EVENTS } from "../../events/event.constants"

@Injectable()
export class FraudService {
  constructor(
    private repo: FraudRepository,
    private eventPublisher: EventPublisher
  ) {}

  async processClaimTx(payload: any, db: any) {
    const { claim_id, worker_id, payout_amount } = payload

    const fraud_score = Math.random()
    const risk_level =
      fraud_score < 0.7 ? "low" : fraud_score < 0.9 ? "medium" : "high"

    await db.query(
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
        uuid(),
        worker_id,
        claim_id,
        fraud_score,
        risk_level,
        "mock_model",
      ]
    )

    const now = new Date().toISOString()

    if (risk_level === "high") {
      await db.query(
        `
        UPDATE claims
        SET status = 'rejected', rejected_at = NOW()
        WHERE id = $1
        `,
        [claim_id]
      )

      await this.eventPublisher.publish(
        "fraud_stream",
        EVENTS.CLAIM_REJECTED,
        "fraud-module",
        {
          claim_id,
          worker_id,
          reason: "HIGH_RISK",
          rejected_at: now,
        }
      )

    } else {
      await db.query(
        `
        UPDATE claims
        SET status = 'approved', approved_at = NOW()
        WHERE id = $1
        `,
        [claim_id]
      )

      await this.eventPublisher.publish(
        "fraud_stream",
        EVENTS.CLAIM_APPROVED,
        "fraud-module",
        {
          claim_id,
          worker_id,
          payout_amount,
          approved_at: now,
        }
      )   
    }
  }
}