import { Module } from "@nestjs/common";
import { HealthController } from "../routes/health.controller";
import { MenuController } from "../routes/menu.controller";

@Module({
  controllers: [HealthController, MenuController]
})
export class AppModule {}

