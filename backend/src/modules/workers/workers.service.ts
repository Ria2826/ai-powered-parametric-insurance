// src/modules/workers/workers.service.ts
import { Injectable } from "@nestjs/common"
import { WorkersRepository } from "./workers.repository"
import { UpdateWorkerDto } from "./dto/update-worker.dto"
import { v4 as uuid } from "uuid"

@Injectable()
export class WorkersService {
  constructor(private repo: WorkersRepository) {}

  async getOrCreateWorker(userId: string) {
    let worker = await this.repo.findByUserId(userId)

    if (!worker) {
      const workerId = uuid()
      await this.repo.createWorker(workerId, userId)

      worker = await this.repo.findByUserId(userId)
    }

    return worker
  }

  async updateProfile(userId: string, dto: UpdateWorkerDto) {
    const worker = await this.getOrCreateWorker(userId)

    await this.repo.updateWorker(worker.id, dto)

    return { success: true }
  }
}