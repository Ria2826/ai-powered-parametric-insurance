// src/modules/fraud/fraud.consumer.ts

import { Injectable, OnModuleInit } from "@nestjs/common"
import { RedisService } from "../../redis/redis.service"
import { FraudService } from "./fraud.service"
import { PgService } from "../../database/pg.service"

type RedisStreamResponse = [string, [string, string[]][]][]

@Injectable()
export class FraudConsumer implements OnModuleInit {
  constructor(
    private redis: RedisService,
    private fraudService: FraudService,
    private pg: PgService
  ) {}

  async onModuleInit() {
    const client = this.redis.getClient()

    try {
      await client.xgroup(
        "CREATE",
        "claims_stream",
        "fraud_group",
        "$",
        "MKSTREAM"
      )
    } catch (err: any) {
      if (!err.message.includes("BUSYGROUP")) throw err
    }

    this.consume()
  }

  async consume() {
    const client = this.redis.getClient()

    while (true) {
      const response = (await client.xreadgroup(
        "GROUP",
        "fraud_group",
        "fraud_worker_1",
        "BLOCK",
        5000,
        "STREAMS",
        "claims_stream",
        ">"
      )) as RedisStreamResponse

      if (!response) continue

      const [, messages] = response[0]

      for (const [messageId, fields] of messages) {
        try {
          const event = JSON.parse(fields[1])

          const exists = await this.pg.query(
            `SELECT event_id FROM processed_events WHERE event_id = $1`,
            [event.event_id]
          )

          if (exists.length > 0) {
            await this.redis.acknowledge(
              "claims_stream",
              "fraud_group",
              messageId
            )
            continue
          }

          const db = await this.pg.getPool().connect()

          try {
            await db.query("BEGIN")

            if (event.event_type === "CLAIM_CREATED") {
              await this.fraudService.processClaimTx(
                event.payload,
                db
              )
            }

            await db.query(
              `INSERT INTO processed_events(event_id) VALUES ($1)`,
              [event.event_id]
            )

            await db.query("COMMIT")

          } catch (err) {
            await db.query("ROLLBACK")
            throw err
          } finally {
            db.release()
          }

          await this.redis.acknowledge(
            "claims_stream",
            "fraud_group",
            messageId
          )

        } catch (err) {
          console.error("Fraud consumer error:", err)
          // NO ACK -> retry
        }
      }
    }
  }
}