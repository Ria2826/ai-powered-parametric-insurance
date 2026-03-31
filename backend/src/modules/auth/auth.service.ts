// src/modules/auth/auth.service.ts
import { Injectable } from "@nestjs/common"
import { AuthRepository } from "./auth.repository"
import { RegisterDto } from "./dto/register.dto"
import { LoginDto } from "./dto/login.dto"
import * as bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"
import { v4 as uuid } from "uuid"

@Injectable()
export class AuthService {
  constructor(private repo: AuthRepository) {}

  async register(dto: RegisterDto) {
    const existing = await this.repo.findByEmail(dto.email)

    if (existing) {
      throw new Error("EMAIL_ALREADY_EXISTS")
    }

    const passwordHash = await bcrypt.hash(dto.password, 10)

    const userId = uuid()

    await this.repo.createUser(userId, dto.email, passwordHash)

    return { userId }
  }

  async login(dto: LoginDto) {
    const user = await this.repo.findByEmail(dto.email)

    if (!user) {
      throw new Error("INVALID_CREDENTIALS")
    }

    const isValid = await bcrypt.compare(dto.password, user.password_hash)

    if (!isValid) {
      throw new Error("INVALID_CREDENTIALS")
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    )

    return { token }
  }
}