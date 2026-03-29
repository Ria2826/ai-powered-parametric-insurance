// src/modules/ingestion/ingestion.service.ts
import { Injectable } from "@nestjs/common"
import { WeatherProvider } from "./providers/weather.provider"
import { DisruptionsService } from "../disruptions/disruptions.service"
import { PgService } from "../../database/pg.service"
import { v4 as uuid } from "uuid"

type Zone = {
  id: string
  name: string
  lat: number
  lon: number
}

@Injectable()
export class IngestionService {
  constructor(
    private weather: WeatherProvider,
    private disruptionsService: DisruptionsService,
    private pg: PgService
  ) {}

  async process() {
    const zones = await this.getZones()

    for (const zone of zones) {
      try {
        const weather = await this.weather.getRainfall(zone.lat, zone.lon)

        const disruption = this.detectDisruption(zone, weather)

        if (!disruption) continue

        const alreadyExists = await this.isDuplicate(disruption)

        if (alreadyExists) continue

        await this.disruptionsService.createDisruptionInternal(disruption)

      } catch (err) {
        console.error(`Ingestion failed for zone ${zone.id}`, err)
      }
    }
  }

  private async getZones(): Promise<Zone[]> {
    const res = await this.pg.query(
      `
      SELECT id, zone_name, latitude, longitude
      FROM zones
      `
    )

    return res
  }

  private detectDisruption(zone: Zone, weather: any) {
    const rainfall = weather.rainfall_mm

    if (rainfall >= 50) {
      return {
        id: uuid(),
        zone_id: zone.id,
        type: "rainfall",
        severity: "high",
        rainfall_mm: rainfall,
        start_time: new Date().toISOString(),
        expected_duration_minutes: 120,
      }
    }

    if (rainfall >= 20) {
      return {
        id: uuid(),
        zone_id: zone.id,
        type: "RAIN",
        severity: "MEDIUM",
        rainfall_mm: rainfall,
        detected_at: new Date().toISOString(),
        expected_duration_minutes: 60,
      }
    }

    return null
  }

  private async isDuplicate(disruption: any): Promise<boolean> {
    const res = await this.pg.query(
      `
      SELECT id FROM disruptions
      WHERE zone_id = $1
      AND type = $2
      AND detected_at > NOW() - INTERVAL '10 minutes'
      `,
      [disruption.zone_id, disruption.type]
    )

    return res.length > 0
  }
}