import { drizzle } from "drizzle-orm/node-postgres";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Pool } from "pg";
import { menuCategories, menuItems, restaurants } from "./schema";

type MenuCatalogFile = {
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

const restaurant = {
  id: "kino-restaurant",
  slug: "kino",
  name: "木野餐廳"
};

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for database seeding.");
  }

  const catalogPath = await resolveCatalogPath();
  const catalog = JSON.parse(await readFile(catalogPath, "utf8")) as MenuCatalogFile;
  const pool = new Pool({ connectionString: databaseUrl });
  const db = drizzle(pool);

  try {
    await db
      .insert(restaurants)
      .values(restaurant)
      .onConflictDoUpdate({
        target: restaurants.id,
        set: {
          slug: restaurant.slug,
          name: restaurant.name,
          updatedAt: new Date()
        }
      });

    for (const [categoryIndex, category] of catalog.categories.entries()) {
      await db
        .insert(menuCategories)
        .values({
          id: category.id,
          restaurantId: restaurant.id,
          slug: category.id,
          name: category.name,
          displayOrder: categoryIndex + 1,
          isActive: true,
          updatedAt: new Date()
        })
        .onConflictDoUpdate({
          target: menuCategories.id,
          set: {
            slug: category.id,
            name: category.name,
            displayOrder: categoryIndex + 1,
            isActive: true,
            updatedAt: new Date()
          }
        });

      for (const [itemIndex, item] of category.items.entries()) {
        const id = `${category.id}-${String(itemIndex + 1).padStart(2, "0")}`;
        const priceTwd = item.price ?? item.priceFrom ?? null;

        await db
          .insert(menuItems)
          .values({
            id,
            restaurantId: restaurant.id,
            categoryId: category.id,
            slug: id,
            name: item.name,
            portion: item.portion ?? null,
            priceTwd,
            priceLabel: item.priceFrom ? `${item.priceFrom} 元起` : null,
            status: "open",
            inventoryMode: "manual",
            stockQuantity: null,
            displayOrder: itemIndex + 1,
            metadata: {
              seededFrom: "data/menu-catalog.json"
            },
            updatedAt: new Date()
          })
          .onConflictDoUpdate({
            target: menuItems.id,
            set: {
              categoryId: category.id,
              slug: id,
              name: item.name,
              portion: item.portion ?? null,
              priceTwd,
              priceLabel: item.priceFrom ? `${item.priceFrom} 元起` : null,
              displayOrder: itemIndex + 1,
              updatedAt: new Date()
            }
          });
      }
    }
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});

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
