// src/modules/ingestion/providers/weather.provider.ts
import { Injectable } from "@nestjs/common"

@Injectable()
export class WeatherProvider {
  private API_KEY = process.env.WEATHER_API_KEY

  async getRainfall(lat: number, lon: number) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}`

    const res = await fetch(url)
    if (!res.ok) throw new Error("Weather API failed")

    const data = await res.json()

    return {
      rainfall_mm: data?.rain?.["1h"] || 0,
      raw: data,
    }
  }
}