// src/modules/workers/workers.controller.ts
import { Controller, Get, Put, Body, Req } from "@nestjs/common"
import { WorkersService } from "./workers.service"
import { UpdateWorkerDto } from "./dto/update-worker.dto"

@Controller("workers")
export class WorkersController {
  constructor(private service: WorkersService) {}

  @Get("me")
  async getMe(@Req() req: any) {
    const userId = req.user.userId
    return this.service.getOrCreateWorker(userId)
  }

  @Put("profile")
  async update(@Req() req: any, @Body() dto: UpdateWorkerDto) {
    const userId = req.user.userId
    return this.service.updateProfile(userId, dto)
  }
}