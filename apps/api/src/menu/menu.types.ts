export type MenuItemStatus = "open" | "limited" | "closed";
export type InventoryMode = "manual" | "tracked";

export type PublicMenuItem = {
  id: string;
  name: string;
  description: string | null;
  portion: string | null;
  priceTwd: number | null;
  priceLabel: string | null;
  status: MenuItemStatus;
  inventoryMode: InventoryMode;
  stockQuantity: number | null;
};

export type PublicMenuCategory = {
  id: string;
  name: string;
  items: PublicMenuItem[];
};

export type MenuRepositoryResult = {
  source: "postgresql" | "json-fallback";
  categories: PublicMenuCategory[];
};

export type MenuCatalogFile = {
  schemaVersion: number;
  currency: string;
  source: string;
  categories: Array<{
    id: string;
    name: string;
    items: Array<{
      name: string;
      portion?: string;
      price?: number;
      priceFrom?: number;
    }>;
  }>;
};
