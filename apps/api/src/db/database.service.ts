import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export type AppDatabase = NodePgDatabase<typeof schema>;

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly pool?: Pool;
  private readonly database?: AppDatabase;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      return;
    }

    this.pool = new Pool({
      connectionString: databaseUrl,
      max: Number(process.env.DATABASE_POOL_MAX ?? 10)
    });
    this.database = drizzle(this.pool, { schema });
  }

  get isConfigured() {
    return Boolean(this.database);
  }

  get client() {
    if (!this.database) {
      throw new Error("DATABASE_URL is not configured.");
    }

    return this.database;
  }

  async ping() {
    if (!this.pool) {
      return { configured: false, reachable: false };
    }

    await this.pool.query("select 1");
    return { configured: true, reachable: true };
  }

  async onModuleDestroy() {
    await this.pool?.end();
  }
}
