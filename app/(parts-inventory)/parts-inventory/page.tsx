"use client";

import { useMemo, useState } from "react";
import { AddPartModal } from "@/components/parts-inventory/add-part-modal";
import { FeaturePanel } from "@/components/parts-inventory/feature-panel";
import { InventoryFilters } from "@/components/parts-inventory/inventory-filters";
import { InventoryHeader } from "@/components/parts-inventory/inventory-header";
import { InventoryMetrics } from "@/components/parts-inventory/inventory-metrics";
import { InventorySidebar } from "@/components/parts-inventory/inventory-sidebar";
import { InventoryToolbar } from "@/components/parts-inventory/inventory-toolbar";
import { partFromFormData } from "@/components/parts-inventory/part-from-form";
import { PartsTable } from "@/components/parts-inventory/parts-table";
import { PrintList } from "@/components/parts-inventory/print-list";
import { useStoredParts } from "@/components/parts-inventory/use-stored-parts";

export default function PartsInventoryPage() {
  const [parts, updateParts] = useStoredParts();
  const [active, setActive] = useState("Parts Inventory");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [selected, setSelected] = useState<number[]>([]);
  const [notice, setNotice] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [printInventory, setPrintInventory] = useState(false);

  const filtered = useMemo(
    () =>
      parts.filter(
        (part) =>
          (category === "All categories" || part.category === category) &&
          `${part.name} ${part.sku} ${part.year} ${part.make} ${part.model} ${part.trim} ${part.engine} ${part.drivetrain} ${part.transmission} ${part.vin} ${part.donorStock} ${part.shelf}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [parts, query, category],
  );

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };

  const printSelectedInventory = () => {
    setPrintInventory(true);
    flash(
      `${selected.length || filtered.length} item labels ready — choose a printer in the system dialog`,
    );
    window.setTimeout(() => {
      window.print();
      setPrintInventory(false);
    }, 100);
  };

  function addPart(formData: FormData) {
    const part = partFromFormData(formData);
    updateParts((current) => [...current, part]);
    setShowNew(false);
    flash(`Part added under donor stock ${part.donorStock}`);
  }

  return (
    <main className="inventoryApp min-h-screen bg-[#eef1f5] text-slate-950">
      <InventoryHeader onAdd={() => setShowNew(true)} />
      <div className="mx-auto grid max-w-[1500px] gap-5 px-4 py-5 lg:grid-cols-[230px_1fr] lg:px-8">
        <InventorySidebar active={active} onSelect={setActive} flash={flash} />
        <section className="min-w-0 space-y-5">
          <InventoryToolbar
            active={active}
            flash={flash}
            onPrint={printSelectedInventory}
          />
          <InventoryMetrics parts={parts} />
          {active !== "Parts Inventory" ? (
            <FeaturePanel active={active} flash={flash} />
          ) : (
            <>
              <InventoryFilters
                parts={parts}
                query={query}
                onQueryChange={setQuery}
                category={category}
                onCategoryChange={setCategory}
              />
              <PartsTable
                filtered={filtered}
                totalCount={parts.length}
                selected={selected}
                setSelected={setSelected}
                flash={flash}
              />
            </>
          )}
        </section>
      </div>
      <PrintList
        parts={parts}
        filtered={filtered}
        selected={selected}
        active={printInventory}
      />
      {showNew && (
        <AddPartModal onClose={() => setShowNew(false)} onSave={addPart} />
      )}
      {notice && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm rounded-xl bg-[#071b36] px-5 py-4 font-semibold text-white shadow-2xl">
          {notice}
        </div>
      )}
    </main>
  );
}
