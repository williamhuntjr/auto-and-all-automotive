import type { Dispatch, SetStateAction } from "react";
import type { Part } from "./types";
import { StatusBadge } from "./status-badge";
import { Barcode, ChevronDown, Link2 } from "lucide-react";

export function PartsTable({
  filtered,
  totalCount,
  selected,
  setSelected,
  flash,
}: {
  filtered: Part[];
  totalCount: number;
  selected: number[];
  setSelected: Dispatch<SetStateAction<number[]>>;
  flash: (message: string) => void;
}) {
  const allSelected =
    filtered.length > 0 && filtered.every((part) => selected.includes(part.id));
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1380px] border-collapse text-left">
          <thead className="bg-[#e5eaf0] text-sm text-slate-700">
            <tr>
              <th className="p-4">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() =>
                    setSelected(allSelected ? [] : filtered.map((p) => p.id))
                  }
                />
              </th>
              {[
                "Part / SKU",
                "Donor vehicle & powertrain",
                "PNC stock / VIN",
                "Category",
                "Shelf",
                "On hand",
                "Cost",
                "Retail",
                "Status",
                "Fitment",
                "",
              ].map((x) => (
                <th key={x} className="p-4 font-extrabold">
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr
                key={p.id}
                className="border-t border-slate-100 hover:bg-blue-50/40"
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selected.includes(p.id)}
                    onChange={() =>
                      setSelected((s) =>
                        s.includes(p.id)
                          ? s.filter((x) => x !== p.id)
                          : [...s, p.id],
                      )
                    }
                  />
                </td>
                <td className="p-4">
                  <p className="font-extrabold">{p.name}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-[#1768ac]">
                    <Barcode className="h-4 w-4" />
                    {p.sku}
                  </p>
                  {p.interchangeNumber && (
                    <p className="mt-1 text-xs font-bold text-slate-600">
                      Interchange: {p.interchangeNumber}
                    </p>
                  )}
                  {p.conditionRating && (
                    <p className="mt-1 text-xs font-bold text-emerald-700">
                      Condition: {p.conditionRating}/10
                    </p>
                  )}
                </td>
                <td className="p-4">
                  <p className="font-extrabold">
                    {p.year} {p.make} {p.model} {p.trim}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {p.engine} · {p.drivetrain}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {p.transmission}
                  </p>
                </td>
                <td className="p-4">
                  <span className="rounded-lg bg-blue-100 px-2.5 py-1.5 font-mono font-black text-[#0d5796]">
                    {p.donorStock}
                  </span>
                  <p className="mt-2 font-mono text-xs text-slate-500">
                    {p.vin}
                  </p>
                </td>
                <td className="p-4 font-semibold">{p.category}</td>
                <td className="p-4">
                  <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 font-mono font-bold">
                    {p.shelf}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-lg font-black">{p.stock}</span>
                  <p className="text-xs text-slate-500">
                    Reorder at {p.reorder}
                  </p>
                </td>
                <td className="p-4 font-semibold">${p.cost.toFixed(2)}</td>
                <td className="p-4 font-extrabold">${p.price.toFixed(2)}</td>
                <td className="p-4">
                  <StatusBadge value={p.status} />
                </td>
                <td className="p-4">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://chatgpt.com/?q=${encodeURIComponent(`Find verified automotive part interchange candidates for ${p.name}, donor ${p.year} ${p.make} ${p.model} ${p.trim}, ${p.engine}, ${p.drivetrain}, ${p.transmission}. State that OEM part number and fitment must be verified before sale.`)}`}
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 font-bold text-[#0d5796] hover:bg-blue-100"
                  >
                    <Link2 className="h-4 w-4" />
                    AI interchange
                  </a>
                  <p className="mt-1 text-xs text-slate-500">
                    Verify OEM fitment
                  </p>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => flash(`${p.name} opened for editing`)}
                    className="rounded-lg p-2 hover:bg-slate-100"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-5 py-4 text-sm font-semibold text-slate-600">
        <span>
          Showing {filtered.length} of {totalCount} parts
        </span>
        <span>{selected.length} selected</span>
      </div>
    </div>
  );
}
