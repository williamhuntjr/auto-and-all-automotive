import { boolean, integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const serviceCategories = pgTable("service_categories", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id"),
  name: varchar("name", { length: 160 }).notNull(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  description: text("description").notNull().default(""),
  image: text("image").notNull().default(""),
  displayOrder: integer("display_order").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
});
