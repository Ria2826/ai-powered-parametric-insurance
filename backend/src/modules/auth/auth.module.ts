// src/modules/auth/auth.module.ts
import { Module } from "@nestjs/common"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { AuthRepository } from "./auth.repository"
import { DatabaseModule } from "../../database/database.module"

@Module({
  imports: [DatabaseModule], 
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
})
export class AuthModule {}