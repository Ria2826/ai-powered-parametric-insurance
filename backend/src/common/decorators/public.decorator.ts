// src/common/decorators/public.decorators.ts
import { SetMetadata } from "@nestjs/common"

export const Public = () => SetMetadata("isPublic", true)