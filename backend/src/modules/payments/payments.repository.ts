// src/modules/payments/payments.repository.ts

import { Injectable } from "@nestjs/common"
import { PgService } from "../../database/pg.service"

@Injectable()
export class PaymentsRepository {
  constructor(private pg: PgService) {}

  async createPayment(data: {
    id: string
    claim_id: string
    amount: number
    status: string
    transaction_reference: string
  }) {
    await this.pg.query(
      `
      INSERT INTO payments (
        id,
        claim_id,
        amount,
        payment_status,
        transaction_reference,
        processed_at
      )
      VALUES ($1, $2, $3, $4, $5, NOW())
      `,
      [
        data.id,
        data.claim_id,
        data.amount,
        data.status,
        data.transaction_reference,
      ]
    )
  }

  async markClaimPaid(claimId: string) {
    await this.pg.query(
      `
      UPDATE claims
      SET status = 'paid', paid_at = NOW()
      WHERE id = $1
      `,
      [claimId]
    )
  }
}