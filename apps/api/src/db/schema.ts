import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex
} from "drizzle-orm/pg-core";

export const inventoryMode = pgEnum("inventory_mode", ["manual", "tracked"]);
export const menuItemStatus = pgEnum("menu_item_status", ["open", "limited", "closed"]);

export const restaurants = pgTable("restaurants", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  timezone: text("timezone").notNull().default("Asia/Taipei"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const menuCategories = pgTable(
  "menu_categories",
  {
    id: text("id").primaryKey(),
    restaurantId: text("restaurant_id")
      .notNull()
      .references(() => restaurants.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    displayOrder: integer("display_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    uniqueIndex("menu_categories_restaurant_slug_idx").on(table.restaurantId, table.slug)
  ]
);

export const menuItems = pgTable(
  "menu_items",
  {
    id: text("id").primaryKey(),
    restaurantId: text("restaurant_id")
      .notNull()
      .references(() => restaurants.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => menuCategories.id, { onDelete: "restrict" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    portion: text("portion"),
    priceTwd: integer("price_twd"),
    priceLabel: text("price_label"),
    status: menuItemStatus("status").notNull().default("open"),
    inventoryMode: inventoryMode("inventory_mode").notNull().default("manual"),
    stockQuantity: integer("stock_quantity"),
    displayOrder: integer("display_order").notNull().default(0),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    uniqueIndex("menu_items_restaurant_slug_idx").on(table.restaurantId, table.slug)
  ]
);
