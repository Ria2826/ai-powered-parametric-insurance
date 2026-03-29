// src/modules/workers/workers.repository.ts
import { Injectable } from "@nestjs/common"
import { PgService } from "../../database/pg.service"

@Injectable()
export class WorkersRepository {
  constructor(private pg: PgService) {}

  async findByUserId(userId: string) {
    const rows = await this.pg.query(
      `SELECT * FROM workers WHERE user_id = $1`,
      [userId]
    )

    return rows[0] || null
  }

  async createWorker(id: string, userId: string) {
    await this.pg.query(
      `
      INSERT INTO workers (id, user_id, platform_name, avg_hourly_income)
      VALUES ($1, $2, '', 0)
      `,
      [id, userId]
    )
  }

  async updateWorker(workerId: string, dto: any) {
    await this.pg.query(
      `
      UPDATE workers
      SET platform_name = $1,
          primary_zone_id = $2,
          avg_hourly_income = $3,
          updated_at = NOW()
      WHERE id = $4
      `,
      [
        dto.platform_name,
        dto.primary_zone_id,
        dto.avg_hourly_income,
        workerId,
      ]
    )
  }
}