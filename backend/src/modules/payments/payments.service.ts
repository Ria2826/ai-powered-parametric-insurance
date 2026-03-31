// src/modules/payments/payments.service.ts

import { Injectable } from "@nestjs/common"
import { PaymentsRepository } from "./payments.repository"
import { v4 as uuid } from "uuid"
import { EventPublisher } from "../../events/event.publisher"
import { EVENTS } from "../../events/event.constants"

@Injectable()
export class PaymentsService {
  constructor(
    private repo: PaymentsRepository,
    private eventPublisher: EventPublisher
  ) {}

  async processPaymentTx(payload: any, db: any) {
    const { claim_id, worker_id, payout_amount } = payload

    const paymentId = uuid()
    const transactionRef = `txn_${Date.now()}`
    const now = new Date().toISOString()

    try {
      await db.query(
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
          paymentId,
          claim_id,
          payout_amount,
          "success",
          transactionRef,
        ]
      )

      await db.query(
        `
        UPDATE claims
        SET status = 'paid', paid_at = NOW()
        WHERE id = $1
        `,
        [claim_id]
      )

      await this.eventPublisher.publish(
        "payments_stream",
        EVENTS.PAYMENT_PROCESSED,
        "payments-module",
        {
          payment_id: paymentId,
          claim_id,
          worker_id,
          payout_amount,
          payment_status: "success",
          processed_at: now,
        }
      )

    } catch (err) {
      await this.eventPublisher.publish(
        "payments_stream",
        EVENTS.PAYMENT_FAILED,
        "payments-module",
        {
          claim_id,
          worker_id,
          payout_amount,
          payment_status: "failed",
        }
      )

      throw err
    }
  }
}