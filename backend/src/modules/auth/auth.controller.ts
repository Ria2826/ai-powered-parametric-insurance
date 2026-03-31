// src/modules/auth/auth.controller.ts
import { Controller, Post, Body } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { RegisterDto } from "./dto/register.dto"
import { LoginDto } from "./dto/login.dto"
import { Public } from "../../common/decorators/public.decorator"

@Controller("auth")
export class AuthController {
  constructor(private service: AuthService) {}

  @Public()
  @Post("register")
  async register(@Body() dto: RegisterDto) {
    return this.service.register(dto)
  }

  @Public()
  @Post("login")
  async login(@Body() dto: LoginDto) {
    return this.service.login(dto)
  }
}