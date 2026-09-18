import type { Part } from "./types";

export function StatusBadge({ value }: { value: Part["status"] }) {
  const style =
    value === "In stock"
      ? "bg-emerald-100 text-emerald-800"
      : value === "Low stock"
        ? "bg-amber-100 text-amber-800"
        : "bg-red-100 text-red-800";
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-extrabold ${style}`}
    >
      {value}
    </span>
  );
}
