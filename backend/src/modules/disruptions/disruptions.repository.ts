// src/modules/disruptions/disruptions.repository.ts

import { Injectable } from "@nestjs/common"
import { PgService } from "../../database/pg.service"

@Injectable()
export class DisruptionsRepository {
  constructor(private pg: PgService) {}

  async createDisruption(data: {
    id: string
    zone_id: string
    type: string
    severity: string
    metric_value: number
    threshold_value: number
    start_time: string
  }) {
    await this.pg.query(
      `
      INSERT INTO disruptions (
        id,
        zone_id,
        type,
        severity,
        metric_value,
        threshold_value,
        start_time
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [
        data.id,
        data.zone_id,
        data.type,
        data.severity,
        data.metric_value,
        data.threshold_value,
        data.start_time,
      ]
    )
  }
}