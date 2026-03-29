// src/modules/policies/policies.controller.ts
import { Controller, Post, Get, Body, Req } from "@nestjs/common"
import { PoliciesService } from "./policies.service"
import { CreatePolicyDto } from "./dto/create-policy.dto"

@Controller("policies")
export class PoliciesController {
  constructor(private service: PoliciesService) {}

  @Post()
  async create(@Req() req: any, @Body() dto: CreatePolicyDto) {
    return this.service.createPolicy(req.user.userId, dto)
  }

  @Get("me")
  async getMyPolicies(@Req() req: any) {
    return this.service.getMyPolicies(req.user.userId)
  }
}