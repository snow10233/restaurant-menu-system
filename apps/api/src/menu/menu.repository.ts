import { Injectable } from "@nestjs/common";
import { and, asc, eq } from "drizzle-orm";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { DatabaseService } from "../db/database.service";
import { menuCategories, menuItems } from "../db/schema";
import {
  MenuCatalogFile,
  MenuRepositoryResult,
  PublicMenuCategory,
  PublicMenuItem
} from "./menu.types";

const RESTAURANT_ID = "kino-restaurant";

@Injectable()
export class MenuRepository {
  private cachedFallback?: PublicMenuCategory[];

  constructor(private readonly databaseService: DatabaseService) {}

  async findPublicMenu(): Promise<MenuRepositoryResult> {
    if (!this.databaseService.isConfigured) {
      return {
        source: "json-fallback",
        categories: await this.readFallbackCatalog()
      };
    }

    return {
      source: "postgresql",
      categories: await this.readDatabaseCatalog()
    };
  }

  private async readDatabaseCatalog() {
    const rows = await this.databaseService.client
      .select({
        categoryId: menuCategories.id,
        categoryName: menuCategories.name,
        itemId: menuItems.id,
        itemName: menuItems.name,
        itemDescription: menuItems.description,
        itemPortion: menuItems.portion,
        itemPriceTwd: menuItems.priceTwd,
        itemPriceLabel: menuItems.priceLabel,
        itemStatus: menuItems.status,
        itemInventoryMode: menuItems.inventoryMode,
        itemStockQuantity: menuItems.stockQuantity
      })
      .from(menuCategories)
      .leftJoin(menuItems, eq(menuItems.categoryId, menuCategories.id))
      .where(and(eq(menuCategories.restaurantId, RESTAURANT_ID), eq(menuCategories.isActive, true)))
      .orderBy(asc(menuCategories.displayOrder), asc(menuItems.displayOrder));

    const categories = new Map<string, PublicMenuCategory>();

    for (const row of rows) {
      const category =
        categories.get(row.categoryId) ??
        createCategory(row.categoryId, row.categoryName);

      if (row.itemId) {
        category.items.push({
          id: row.itemId,
          name: row.itemName ?? "",
          description: row.itemDescription,
          portion: row.itemPortion,
          priceTwd: row.itemPriceTwd,
          priceLabel: row.itemPriceLabel,
          status: row.itemStatus ?? "closed",
          inventoryMode: row.itemInventoryMode ?? "manual",
          stockQuantity: row.itemStockQuantity
        });
      }

      categories.set(category.id, category);
    }

    return Array.from(categories.values());
  }

  private async readFallbackCatalog() {
    if (this.cachedFallback) {
      return this.cachedFallback;
    }

    const catalogPath = await resolveCatalogPath();
    const catalog = JSON.parse(await readFile(catalogPath, "utf8")) as MenuCatalogFile;

    this.cachedFallback = catalog.categories.map((category) => ({
      id: category.id,
      name: category.name,
      items: category.items.map((item, index) => ({
        id: `${category.id}-${String(index + 1).padStart(2, "0")}`,
        name: item.name,
        description: null,
        portion: item.portion ?? null,
        priceTwd: item.price ?? item.priceFrom ?? null,
        priceLabel: item.priceFrom ? `${item.priceFrom} 元起` : null,
        status: "open",
        inventoryMode: "manual",
        stockQuantity: null
      }))
    }));

    return this.cachedFallback;
  }
}

function createCategory(id: string, name: string) {
  return {
    id,
    name,
    items: []
  };
}

async function resolveCatalogPath() {
  const candidates = [
    resolve(process.cwd(), "data/menu-catalog.json"),
    resolve(process.cwd(), "../../data/menu-catalog.json")
  ];

  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      continue;
    }
  }

  throw new Error("Unable to find data/menu-catalog.json.");
}
