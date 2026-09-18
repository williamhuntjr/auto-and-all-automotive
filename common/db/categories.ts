import { getDb } from "./index";

export type CategoryRecord = {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  description: string;
  image: string;
  display_order: number;
  is_visible: boolean;
};

export type CategoryInput = {
  parentId: number | null;
  name: string;
  slug: string;
  description: string;
  image: string;
  displayOrder: number;
  isVisible: boolean;
};

export async function listCategories(
  includeHidden = false,
): Promise<CategoryRecord[]> {
  const sql = getDb();
  return sql<CategoryRecord[]>`
    SELECT id, parent_id, name, slug, description, image, display_order, is_visible
    FROM service_categories
    ${includeHidden ? sql`` : sql`WHERE is_visible = true`}
    ORDER BY display_order, name`;
}

export async function createCategory(input: CategoryInput): Promise<number> {
  const sql = getDb();
  const [created] = await sql<{ id: number }[]>`
    INSERT INTO service_categories
      (parent_id, name, slug, description, image, display_order, is_visible)
    VALUES
      (${input.parentId}, ${input.name}, ${input.slug}, ${input.description},
       ${input.image}, ${input.displayOrder}, ${input.isVisible})
    RETURNING id`;
  return created.id;
}

export async function updateCategory(
  id: number,
  input: CategoryInput,
): Promise<void> {
  const sql = getDb();
  await sql`
    UPDATE service_categories SET
      parent_id = ${input.parentId},
      name = ${input.name},
      slug = ${input.slug},
      description = ${input.description},
      image = ${input.image},
      display_order = ${input.displayOrder},
      is_visible = ${input.isVisible}
    WHERE id = ${id}`;
}

/** Deletes a category along with its direct subcategories. */
export async function deleteCategory(id: number): Promise<void> {
  const sql = getDb();
  await sql.begin(async (transaction) => {
    await transaction`DELETE FROM service_categories WHERE parent_id = ${id}`;
    await transaction`DELETE FROM service_categories WHERE id = ${id}`;
  });
}
