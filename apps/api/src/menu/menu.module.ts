import { Module } from "@nestjs/common";
import { DatabaseModule } from "../db/database.module";
import { MenuRepository } from "./menu.repository";
import { MenuService } from "./menu.service";

@Module({
  imports: [DatabaseModule],
  providers: [MenuRepository, MenuService],
  exports: [MenuService]
})
export class MenuModule {}
