export type Page = "menu" | "dish" | "staff";

export type StockStatus = "open" | "limited" | "closed";

export interface DishChoiceOption {
  label: string;
  priceDelta: number;
}

export interface DishChoiceGroup {
  id: string;
  label: string;
  options: DishChoiceOption[];
}

export interface DishUpgrade {
  label: string;
  priceDelta: number;
  description: string;
  choiceGroups: DishChoiceGroup[];
}

export interface Dish {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  price: number;
  priceLabel?: string;
  orderable: boolean;
  image?: string;
  description: string;
  notes: string[];
  status: StockStatus;
  stockText: string;
  choiceGroups: DishChoiceGroup[];
  upgrade?: DishUpgrade;
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
