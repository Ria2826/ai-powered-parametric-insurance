// src/modules/disruptions/disruptions.service.ts

import { Injectable } from "@nestjs/common"
import { DisruptionsRepository } from "./disruptions.repository"
import { CreateDisruptionDto } from "./dto/create-disruption.dto"
import { v4 as uuid } from "uuid"
import { EventPublisher } from "../../events/event.publisher"
import { EVENTS } from "../../events/event.constants"

@Injectable()
export class DisruptionsService {
  constructor(
    private repo: DisruptionsRepository,
    private eventPublisher: EventPublisher
  ) {}

  async detectAndCreate(dto: CreateDisruptionDto) {
    // mock
    const thresholdMap: any = {
      rainfall: 50,
      temperature: 42,
      aqi: 300,
      traffic: 85,
    }

    const threshold = thresholdMap[dto.type]

    if (dto.metric_value < threshold) {
      return { message: "NO_DISRUPTION" }
    }

    const severity = dto.metric_value > threshold * 1.5 ? "high" : "medium"

    const disruptionId = uuid()
    const now = new Date().toISOString()

    await this.repo.createDisruption({
      id: disruptionId,
      zone_id: dto.zone_id,
      type: dto.type,
      severity,
      metric_value: dto.metric_value,
      threshold_value: threshold,
      start_time: now,
    })

    await this.eventPublisher.publish(
      "disruptions_stream",
      EVENTS.DISRUPTION_DETECTED,
      "disruptions-module",
      {
        disruption_id: disruptionId,
        zone_id: dto.zone_id,
        disruption_type: dto.type,
        severity,
        detected_at: now,
        expected_duration_minutes: 60,
      }
    )

    return {
      disruption_id: disruptionId,
      status: "TRIGGERED",
    }
  }

  async createDisruptionInternal(payload: any) {
    const {
      id,
      zone_id,
      type,
      severity,
      rainfall_mm,
      detected_at,
      expected_duration_minutes,
    } = payload

    await this.repo.createDisruption({
      id,
      zone_id,
      type,
      severity,
      metric_value: rainfall_mm,
      threshold_value: severity === "HIGH" ? 50 : 20,
      start_time: detected_at,
    })

    await this.eventPublisher.publish(
      "disruptions_stream",
      EVENTS.DISRUPTION_DETECTED,
      "disruptions-module",
      {
        disruption_id: id,
        zone_id,
        disruption_type: type,
        severity,
        detected_at,
        expected_duration_minutes,
      }
    )
  }
}