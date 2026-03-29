// src/modules/disruptions/disruptions.controller.ts

import { Controller, Post, Body } from "@nestjs/common"
import { DisruptionsService } from "./disruptions.service"
import { CreateDisruptionDto } from "./dto/create-disruption.dto"

@Controller("disruptions")
export class DisruptionsController {
  constructor(private service: DisruptionsService) {}

  @Post("trigger")
  async trigger(@Body() dto: CreateDisruptionDto) {
    return this.service.detectAndCreate(dto)
  }
}