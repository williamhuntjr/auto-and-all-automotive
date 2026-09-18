import {
  Box,
  Grid2X2,
  Link2,
  QrCode,
  Share2,
  Truck,
  Warehouse,
} from "lucide-react";

export const inventoryTabs = [
  ["Parts Inventory", Grid2X2],
  ["Shelving", Warehouse],
  ["Barcode & QR", QrCode],
  ["Packing", Box],
  ["Shipping", Truck],
  ["Sales channels", Share2],
] as const;

export function InventorySidebar({
  active,
  onSelect,
  flash,
}: {
  active: string;
  onSelect: (tab: string) => void;
  flash: (message: string) => void;
}) {
  return (
    <aside className="rounded-2xl bg-[#0d2849] p-3 text-white shadow-xl lg:min-h-[820px]">
      <p className="px-3 pb-2 pt-3 text-xs font-bold uppercase tracking-[.16em] text-blue-300">
        Operations
      </p>
      <nav className="space-y-1">
        {inventoryTabs.map(([label, Icon]) => (
          <button
            key={label}
            onClick={() => onSelect(label)}
            className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left font-semibold ${active === label ? "bg-[#1768ac] shadow" : "text-blue-100 hover:bg-white/10"}`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </button>
        ))}
      </nav>
      <div className="mt-8 border-t border-white/10 px-3 pt-5">
        <p className="text-sm font-bold">Quick connections</p>
        <div className="mt-3 space-y-2 text-sm text-blue-100">
          {[
            "Online store",
            "Facebook & Instagram",
            "Shipping carrier",
            "Digital scale",
          ].map((x) => (
            <button
              onClick={() => flash(`${x} connector is ready to configure`)}
              key={x}
              className="flex w-full items-center justify-between rounded-lg bg-white/5 px-3 py-2.5 hover:bg-white/10"
            >
              <span>{x}</span>
              <Link2 className="h-4 w-4 text-blue-300" />
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
