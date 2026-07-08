import { Controller, Get } from "@nestjs/common";

const menuPreview = [
  { id: "hana-sushi", name: "花壽司", price: 120, status: "open" },
  { id: "inari-sushi", name: "豆皮壽司", price: 80, status: "open" },
  { id: "pork-fried-rice", name: "松阪豬炒飯", price: 160, status: "limited" },
  { id: "beef-noodle", name: "和風牛肉湯麵", price: 180, status: "closed" }
];

@Controller("menu")
export class MenuController {
  @Get()
  getMenu() {
    return {
      data: menuPreview
    };
  }
}

