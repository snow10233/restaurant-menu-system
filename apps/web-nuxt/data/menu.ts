import catalogJson from "../../../data/menu-catalog.json";
import type { Dish, DishChoiceGroup, DishUpgrade, OrderTicket } from "../types";
import { formatCurrency } from "../utils/format";

type CatalogItem = {
  name: string;
  portion?: string;
  preparation?: string;
  description?: string;
  price?: number;
  priceFrom?: number;
};

type CatalogChoiceItem = {
  code?: string;
  name: string;
  portion?: string;
  preparations?: string[];
  price?: number;
  priceDelta?: number;
  choices?: string[];
};

type CatalogGroup = {
  id: string;
  name: string;
  items: CatalogChoiceItem[];
};

type MenuCatalog = {
  categories: Array<{
    id: string;
    name: string;
    items: CatalogItem[];
  }>;
  setMeals: Array<{
    id: string;
    name: string;
    groups: CatalogGroup[];
    includedSides: string[];
    rules: string[];
  }>;
  setUpgrades: Array<{
    name: string;
    categoryIds: string[];
    priceDelta: number;
    groups: CatalogGroup[];
    includedSides: string[];
  }>;
};

const catalog: MenuCatalog = catalogJson;

// Only these dishes have photos so far.
const dishImages: Record<string, string> = {
  花壽司: "/menu-assets/花壽司.jpeg",
  豆皮壽司: "/menu-assets/豆皮壽司.jpeg",
  義式松阪豬炒飯: "/menu-assets/松阪豬炒飯.jpeg",
  和風牛肉烏龍湯麵: "/menu-assets/和風牛肉湯麵.jpeg"
};

function toChoiceGroup(group: CatalogGroup): DishChoiceGroup {
  return {
    id: group.id,
    label: group.name,
    options: group.items.flatMap((item) =>
      (item.choices ?? [item.name]).map((label) => ({ label, priceDelta: item.priceDelta ?? 0 }))
    )
  };
}

function preparationGroups(preparations: string[] | undefined): DishChoiceGroup[] {
  if (!preparations?.length) return [];
  return [{ id: "preparation", label: "做法", options: preparations.map((label) => ({ label, priceDelta: 0 })) }];
}

function upgradeFor(categoryId: string): DishUpgrade | undefined {
  const upgrade = catalog.setUpgrades.find((item) => item.categoryIds.includes(categoryId));
  if (!upgrade) return undefined;

  return {
    label: upgrade.name,
    priceDelta: upgrade.priceDelta,
    description: `附${upgrade.includedSides.join("／")}，${upgrade.groups.map((group) => group.name).join("、")}`,
    choiceGroups: upgrade.groups.map(toChoiceGroup)
  };
}

function setMealDishes(setMeal: MenuCatalog["setMeals"][number]): Dish[] {
  // The first group lists the mains; each main becomes its own orderable set,
  // and the remaining groups are the sides chosen when ordering it.
  const [mains, ...sideGroups] = setMeal.groups;
  if (!mains) return [];

  const notes = [`定食附餐：${setMeal.includedSides.join("／")}`, ...setMeal.rules];

  return mains.items.map((item) => ({
    id: `${setMeal.id}-${item.code ?? item.name}`,
    name: item.code ? `${item.code} ${item.name}` : item.name,
    category: setMeal.id,
    categoryLabel: setMeal.name,
    price: item.price ?? 0,
    orderable: item.price !== undefined,
    description: [item.portion, "含副餐與定食附餐"].filter(Boolean).join("・"),
    notes,
    status: "open",
    stockText: "供應中",
    choiceGroups: [...preparationGroups(item.preparations), ...sideGroups.map(toChoiceGroup)]
  }));
}

function categoryDishes(category: MenuCatalog["categories"][number]): Dish[] {
  const upgrade = upgradeFor(category.id);

  // Same id scheme as the API seed, so ids line up once the menu comes from the API.
  return category.items.map((item, index) => ({
    id: `${category.id}-${String(index + 1).padStart(2, "0")}`,
    name: item.name,
    category: category.id,
    categoryLabel: category.name,
    price: item.price ?? item.priceFrom ?? 0,
    priceLabel: item.priceFrom ? `${formatCurrency(item.priceFrom)} 起` : undefined,
    orderable: item.price !== undefined,
    image: dishImages[item.name],
    description: [
      item.portion,
      item.preparation,
      item.description,
      upgrade && `可加 ${formatCurrency(upgrade.priceDelta)} 升級定食`
    ]
      .filter(Boolean)
      .join("・"),
    notes: [],
    status: "open",
    stockText: "供應中",
    choiceGroups: [],
    upgrade
  }));
}

export const dishes: Dish[] = [
  ...catalog.setMeals.flatMap(setMealDishes),
  ...catalog.categories.flatMap(categoryDishes)
];

export const orderTickets: OrderTicket[] = [
  {
    table: "A03",
    state: "剛送出",
    items: "花壽司 x 1、義式松阪豬炒飯 x 2",
    action: "標記製作中"
  },
  {
    table: "B01",
    state: "製作中",
    items: "和風牛肉烏龍湯麵 x 1",
    action: "標記完成"
  },
  {
    table: "C05",
    state: "待確認",
    items: "豆皮壽司 x 3、花壽司 x 1",
    action: "接單"
  }
];
