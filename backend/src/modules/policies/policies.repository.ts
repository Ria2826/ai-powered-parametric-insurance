// src/modules/policies/policies.repository.ts
import { Injectable } from "@nestjs/common"
import { PgService } from "../../database/pg.service"

@Injectable()
export class PoliciesRepository {
  constructor(private pg: PgService) {}

  async createPolicy(data: {
    id: string
    worker_id: string
    coverage_amount: number
    weekly_premium: number
    start_date: string
    end_date: string
  }) {
    await this.pg.query(
      `
      INSERT INTO policies (
        id,
        worker_id,
        coverage_amount,
        weekly_premium,
        status,
        start_date,
        end_date
      )
      VALUES ($1, $2, $3, $4, 'active', $5, $6)
      `,
      [
        data.id,
        data.worker_id,
        data.coverage_amount,
        data.weekly_premium,
        data.start_date,
        data.end_date,
      ]
    )
  }

  async findByWorkerId(workerId: string) {
    return this.pg.query(
      `SELECT * FROM policies WHERE worker_id = $1 ORDER BY created_at DESC`,
      [workerId]
    )
  }

  async findActivePolicy(workerId: string) {
    const rows = await this.pg.query(
      `SELECT * FROM policies WHERE worker_id = $1 AND status = 'active'`,
      [workerId]
    )
    return rows[0] || null
  }
}