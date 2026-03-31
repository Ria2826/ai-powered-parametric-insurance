// src/database/pg.service.ts

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { Pool } from 'pg'

@Injectable()
export class PgService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool
  
  onModuleInit() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    })

    // test
    this.pool.query('SELECT 1')
      .then(() => console.log('PostgreSQL connected'))
      .catch((err) => {
        console.error('PostgreSQL connection failed', err)
        process.exit(1)
      })
  }

  async query<T = any>(text: string, params?: any[]): Promise<T> {
    const res = await this.pool.query(text, params)
    return res.rows
  }

  getPool(): Pool {
    return this.pool 
  }

  async onModuleDestroy() {
    await this.pool.end()
  }
}