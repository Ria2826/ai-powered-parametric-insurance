// src/modules/auth/auth.repository.ts
import { Injectable } from "@nestjs/common"
import { PgService } from "../../database/pg.service"

@Injectable()
export class AuthRepository {
  constructor(private pg: PgService) {}

  async createUser(id: string, email: string, passwordHash: string) {
    await this.pg.query(
      `
      INSERT INTO users (id, email, password_hash, role)
      VALUES ($1, $2, $3, 'worker')
      `,
      [id, email, passwordHash]
    )
  }

  async findByEmail(email: string) {
    const rows = await this.pg.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    )

    return rows[0] || null
  }
}