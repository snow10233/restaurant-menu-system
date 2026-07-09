import { Injectable } from "@nestjs/common";
import { MenuRepository } from "./menu.repository";

@Injectable()
export class MenuService {
  constructor(private readonly menuRepository: MenuRepository) {}

  async getPublicMenu() {
    const menu = await this.menuRepository.findPublicMenu();

    return {
      data: menu.categories,
      meta: {
        source: menu.source
      }
    };
  }
}
