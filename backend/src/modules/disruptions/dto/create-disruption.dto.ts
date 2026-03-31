// src/modules/disruptions/dto/create-disruption.dto.ts

export class CreateDisruptionDto {
  zone_id: string
  type: "rainfall" | "temperature" | "aqi" | "traffic"
  metric_value: number
}