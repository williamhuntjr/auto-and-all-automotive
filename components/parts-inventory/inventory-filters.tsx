import type { Part } from "./types";
import { Search, SlidersHorizontal } from "lucide-react";

export function InventoryFilters({
  parts,
  query,
  onQueryChange,
  category,
  onCategoryChange,
}: {
  parts: Part[];
  query: string;
  onQueryChange: (query: string) => void;
  category: string;
  onCategoryChange: (category: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 xl:flex-row">
        <label className="relative flex-1">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="field pl-11"
            placeholder="Search part, VIN, PNC stock number, make, model, or shelf…"
          />
        </label>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="field xl:w-52"
        >
          <option>All categories</option>
          {[...new Set(parts.map((p) => p.category))].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select className="field xl:w-48">
          <option>All stock levels</option>
          <option>In stock</option>
          <option>Low stock</option>
          <option>Out of stock</option>
        </select>
        <button className="action secondary">
          <SlidersHorizontal className="h-5 w-5" /> More filters
        </button>
      </div>
    </div>
  );
}
