// src/common/guards/auth.guards.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import * as jwt from "jsonwebtoken"
import { Reflector } from "@nestjs/core"

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>("isPublic", [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) return true

    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers["authorization"]

    if (!authHeader) {
      throw new UnauthorizedException({ code: "UNAUTHORIZED" })
    }

    const parts = authHeader.split(" ")

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new UnauthorizedException({ code: "INVALID_AUTH_HEADER" })
    }

    const token = parts[1]

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

      request.user = { userId: decoded.userId }

      return true
    } catch {
      throw new UnauthorizedException({ code: "INVALID_TOKEN" })
    }
  }
}