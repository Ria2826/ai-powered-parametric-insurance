// src/modules/policies/policies.module.ts
import { Module } from "@nestjs/common"
import { PoliciesController } from "./policies.controller"
import { PoliciesService } from "./policies.service"
import { PoliciesRepository } from "./policies.repository"
import { DatabaseModule } from "../../database/database.module"
import { WorkersModule } from "../workers/workers.module"

@Module({
  imports: [DatabaseModule, WorkersModule],
  controllers: [PoliciesController],
  providers: [PoliciesService, PoliciesRepository],
})
export class PoliciesModule {}