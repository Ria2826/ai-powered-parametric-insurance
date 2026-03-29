// src/modules/workers/workers.module.ts
import { Module } from "@nestjs/common"
import { WorkersController } from "./workers.controller"
import { WorkersService } from "./workers.service"
import { WorkersRepository } from "./workers.repository"
import { DatabaseModule } from "../../database/database.module"

@Module({
  imports: [DatabaseModule],
  controllers: [WorkersController],
  providers: [WorkersService, WorkersRepository],
  exports: [WorkersRepository],
})
export class WorkersModule {}