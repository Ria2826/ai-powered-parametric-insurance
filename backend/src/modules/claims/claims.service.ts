// src/modules/claims/claims.service.ts

import { Injectable } from "@nestjs/common"
import { ClaimsRepository } from "./claims.repository"
import { v4 as uuid } from "uuid"
import { EventPublisher } from "../../events/event.publisher"
import { EVENTS } from "../../events/event.constants"

@Injectable()
export class ClaimsService {
  constructor(private repo: ClaimsRepository, private eventPublisher: EventPublisher) {}

  async processDisruption(payload: any) {
    const {
      disruption_id,
      zone_id,
      expected_duration_minutes,
    } = payload

    
    const workers = await this.repo.findWorkersByZone(zone_id)

    for (const worker of workers) {
      
      const policy = await this.repo.findActivePolicy(worker.id)
      if (!policy) continue

      
      const hours = expected_duration_minutes / 60
      const payout = Math.round(worker.avg_hourly_income * hours)

      
      const claimId = uuid()

      await this.repo.createClaim({
        id: claimId,
        worker_id: worker.id,
        policy_id: policy.id,
        disruption_id,
        payout_amount: payout,
      })

      await this.eventPublisher.publish(
        "claims_stream",
        EVENTS.CLAIM_CREATED,
        "claims-module",
        {
          claim_id: claimId,
          worker_id: worker.id,
          policy_id: policy.id,
          disruption_id,
          payout_amount: payout,
        }
      )
    }
  }

  async processDisruptionTx(payload: any, db: any) {
    const {
      disruption_id,
      zone_id,
      expected_duration_minutes,
    } = payload

    const workers = await db.query(
      `
      SELECT id, avg_hourly_income
      FROM workers
      WHERE primary_zone_id = $1
      `,
      [zone_id]
    )

    for (const worker of workers.rows) {
      const policyRes = await db.query(
        `
        SELECT id
        FROM policies
        WHERE worker_id = $1
        AND status = 'active'
        AND NOW() BETWEEN start_date AND end_date
        `,
        [worker.id]
      )

      const policy = policyRes.rows[0]
      if (!policy) continue

      const hours = expected_duration_minutes / 60
      const payout = Math.round(worker.avg_hourly_income * hours)

      const claimId = uuid()

      await db.query(
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
          claimId,
          worker.id,
          policy.id,
          disruption_id,
          payout,
        ]
      )

      
      await this.eventPublisher.publish(
        "claims_stream",
        EVENTS.CLAIM_CREATED,
        "claims-module",
        {
          claim_id: claimId,
          worker_id: worker.id,
          policy_id: policy.id,
          disruption_id,
          payout_amount: payout,
        }
      )
    }
  }
}