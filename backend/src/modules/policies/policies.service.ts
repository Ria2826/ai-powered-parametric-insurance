// src/modules/policies/policies.service.ts
import { Injectable, HttpException } from "@nestjs/common"
import { PoliciesRepository } from "./policies.repository"
import { WorkersRepository } from "../workers/workers.repository"
import { CreatePolicyDto } from "./dto/create-policy.dto"
import { v4 as uuid } from "uuid"

@Injectable()
export class PoliciesService {
  constructor(
    private repo: PoliciesRepository,
    private workersRepo: WorkersRepository
  ) {}

  async createPolicy(userId: string, dto: CreatePolicyDto) {
    
    const worker = await this.workersRepo.findByUserId(userId)

    if (!worker) {
      throw new HttpException({ code: "WORKER_NOT_FOUND" }, 404)
    }

    
    const existing = await this.repo.findActivePolicy(worker.id)

    if (existing) {
      throw new HttpException({ code: "ACTIVE_POLICY_EXISTS" }, 400)
    }

    
    const premium = await this.calculatePremium(worker, dto)

    
    const start = new Date()
    const end = new Date()
    end.setDate(start.getDate() + dto.duration_weeks * 7)

    
    const policyId = uuid()

    await this.repo.createPolicy({
      id: policyId,
      worker_id: worker.id,
      coverage_amount: dto.coverage_amount,
      weekly_premium: premium,
      start_date: start.toISOString(),
      end_date: end.toISOString(),
    })

    return {
      policyId,
      weekly_premium: premium,
    }
  }

  async getMyPolicies(userId: string) {
    const worker = await this.workersRepo.findByUserId(userId)

    if (!worker) return []

    return this.repo.findByWorkerId(worker.id)
  }

  // ml later
  private async calculatePremium(worker: any, dto: CreatePolicyDto) {
    return Math.round(dto.coverage_amount * 0.05)
  }
}