import { Controller, Get } from "@nestjs/common";
import { DatabaseService } from "../db/database.service";

@Controller("health")
export class HealthController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  async getHealth() {
    const database = await this.getDatabaseHealth();

    return {
      ok: true,
      service: "menu-system-api",
      database
    };
  }

  private async getDatabaseHealth() {
    try {
      return await this.databaseService.ping();
    } catch (error) {
      return {
        configured: true,
        reachable: false,
        error: error instanceof Error ? error.message : "Unknown database error"
      };
    }
  }
}
