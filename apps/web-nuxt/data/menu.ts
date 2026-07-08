import type { Dish, OrderTicket } from "../types";

export const dishes: Dish[] = [
  {
    id: "hana-sushi",
    name: "花壽司",
    category: "sushi",
    categoryLabel: "壽司",
    price: 120,
    image: "/menu-assets/花壽司.jpeg",
    description: "海苔、醋飯與多種配料捲製，適合作為多人分享品項。",
    status: "open",
    stockText: "供應中"
  },
  {
    id: "inari-sushi",
    name: "豆皮壽司",
    category: "sushi",
    categoryLabel: "壽司",
    price: 80,
    image: "/menu-assets/豆皮壽司.jpeg",
    description: "甜鹹豆皮包裹醋飯，口味溫和，適合小朋友與長輩。",
    status: "open",
    stockText: "供應中"
  },
  {
    id: "pork-fried-rice",
    name: "松阪豬炒飯",
    category: "rice",
    categoryLabel: "飯類",
    price: 160,
    image: "/menu-assets/松阪豬炒飯.jpeg",
    description: "松阪豬口感爽脆，搭配鑊氣炒飯，是現場熱門主食。",
    status: "limited",
    stockText: "限量 6 份"
  },
  {
    id: "beef-noodle",
    name: "和風牛肉湯麵",
    category: "noodle",
    categoryLabel: "麵食",
    price: 180,
    image: "/menu-assets/和風牛肉湯麵.jpeg",
    description: "清爽和風湯底搭配牛肉片，適合想吃熱食的客人。",
    status: "closed",
    stockText: "暫停供應"
  }
];

export const orderTickets: OrderTicket[] = [
  {
    table: "A03",
    state: "剛送出",
    items: "花壽司 x 1、松阪豬炒飯 x 2",
    action: "標記製作中"
  },
  {
    table: "B01",
    state: "製作中",
    items: "和風牛肉湯麵 x 1",
    action: "標記完成"
  },
  {
    table: "C05",
    state: "待確認",
    items: "豆皮壽司 x 3、花壽司 x 1",
    action: "接單"
  }
];

