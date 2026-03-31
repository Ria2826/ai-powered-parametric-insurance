// src/database/database.module.ts
import { Module } from "@nestjs/common"
import { PgService } from "./pg.service"

@Module({
  providers: [PgService],
  exports: [PgService], 
})
export class DatabaseModule {}