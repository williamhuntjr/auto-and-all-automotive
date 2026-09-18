"use client";

import { useEffect, useState } from "react";
import type { CategoryRecord } from "@/common/db/categories";
import { slugify } from "@/common/lib/slugify";
import { starterCategories } from "./starter-categories";

type CategoryForm = {
  id: number;
  parentId: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  displayOrder: number;
  isVisible: boolean;
};

const blankForm: CategoryForm = {
  id: 0,
  parentId: 0,
  name: "",
  slug: "",
  description: "",
  image: "",
  displayOrder: 0,
  isVisible: true,
};

function sendCategory(method: "POST" | "PUT", body: object) {
  return fetch("/api/categories", {
    method,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

export default function CategoryManager() {
  const [items, setItems] = useState<CategoryRecord[]>([]);
  const [form, setForm] = useState(blankForm);

  const load = () =>
    fetch("/api/categories?admin=1")
      .then((response) => response.json())
      .then(setItems);

  useEffect(() => {
    void load();
  }, []);

  async function save() {
    await sendCategory(form.id ? "PUT" : "POST", {
      ...form,
      slug: form.slug || slugify(form.name),
    });
    setForm(blankForm);
    load();
  }

  async function remove(id: number) {
    if (!confirm("Delete this category and its subcategories?")) return;
    await fetch("/api/categories?id=" + id, { method: "DELETE" });
    load();
  }

  async function loadStarterStructure() {
    for (const [index, starter] of starterCategories.entries()) {
      const { children, ...category } = starter;
      const response = await sendCategory("POST", {
        ...category,
        displayOrder: index + 1,
      });
      const { id } = await response.json();
      for (const [childIndex, name] of children.entries()) {
        await sendCategory("POST", {
          parentId: id,
          name,
          slug: starter.slug + "-" + slugify(name),
          description: "Edit this description from the dashboard.",
          displayOrder: childIndex + 1,
        });
      }
    }
    load();
  }

  const edit = (category: CategoryRecord) =>
    setForm({
      id: category.id,
      parentId: category.parent_id || 0,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      displayOrder: category.display_order,
      isVisible: Boolean(category.is_visible),
    });

  const mainCategories = items.filter((item) => !item.parent_id);

  return (
    <div className="adminGrid">
      <section>
        <div className="adminHeading">
          <div>
            <p className="eyebrow">Content manager</p>
            <h1>Categories</h1>
          </div>
          {items.length === 0 && (
            <button className="primary" onClick={loadStarterStructure}>
              Load full service structure
            </button>
          )}
        </div>
        {mainCategories.map((main) => (
          <article className="adminCategory" key={main.id}>
            <div>
              <b>{main.name}</b>
              <span>{main.is_visible ? "Visible" : "Hidden"}</span>
            </div>
            <p>{main.description}</p>
            <div className="adminActions">
              <button onClick={() => edit(main)}>Edit</button>
              <button onClick={() => remove(main.id)}>Delete</button>
            </div>
            <ul>
              {items
                .filter((item) => item.parent_id === main.id)
                .map((sub) => (
                  <li key={sub.id}>
                    <span>{sub.name}</span>
                    <button onClick={() => edit(sub)}>Edit</button>
                  </li>
                ))}
            </ul>
            <button
              className="addSub"
              onClick={() => setForm({ ...blankForm, parentId: main.id })}
            >
              + Add subcategory
            </button>
          </article>
        ))}
      </section>
      <aside className="editorPanel">
        <h2>
          {form.id ? "Update" : "Add"}{" "}
          {form.parentId ? "subcategory" : "category"}
        </h2>
        <label>
          Name
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        <label>
          URL slug
          <input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="Generated from name"
          />
        </label>
        <label>
          Description
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>
        <label>
          Header image path
          <input
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
        </label>
        <label>
          Display order
          <input
            type="number"
            value={form.displayOrder}
            onChange={(e) =>
              setForm({ ...form, displayOrder: Number(e.target.value) })
            }
          />
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={form.isVisible}
            onChange={(e) => setForm({ ...form, isVisible: e.target.checked })}
          />{" "}
          Visible on website
        </label>
        <button className="primary" onClick={save} disabled={!form.name}>
          Save changes
        </button>
      </aside>
    </div>
  );
}
