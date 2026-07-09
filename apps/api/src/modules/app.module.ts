import { Module } from "@nestjs/common";
import { DatabaseModule } from "../db/database.module";
import { MenuModule } from "../menu/menu.module";
import { HealthController } from "../routes/health.controller";
import { MenuController } from "../routes/menu.controller";

@Module({
  imports: [DatabaseModule, MenuModule],
  controllers: [HealthController, MenuController]
})
export class AppModule {}
