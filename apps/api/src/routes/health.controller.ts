import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
  @Get()
  getHealth() {
    return {
      ok: true,
      service: "menu-system-api",
      database: "postgresql-planned"
    };
  }
}

