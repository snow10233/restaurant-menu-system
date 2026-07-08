export type Page = "menu" | "dish" | "staff";

export type DishCategory = "sushi" | "rice" | "noodle" | "seasonal";

export type StockStatus = "open" | "limited" | "closed";

export interface Dish {
  id: string;
  name: string;
  category: DishCategory;
  categoryLabel: string;
  price: number;
  image: string;
  description: string;
  status: StockStatus;
  stockText: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  options: string;
}

export interface OrderTicket {
  table: string;
  state: string;
  items: string;
  action: string;
}

