import { Download, Printer, ScanLine } from "lucide-react";

export function InventoryToolbar({
  active,
  flash,
  onPrint,
}: {
  active: string;
  flash: (message: string) => void;
  onPrint: () => void;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-sm font-bold uppercase tracking-[.14em] text-[#1768ac]">
          Auto And All Automotive
        </p>
        <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
          {active}
        </h1>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() =>
            flash(
              "Scanner opened — camera and handheld scanner setup comes next",
            )
          }
          className="action secondary"
        >
          <ScanLine className="h-5 w-5" /> Scan item
        </button>
        <button
          onClick={() => flash("Inventory CSV prepared for export")}
          className="action secondary"
        >
          <Download className="h-5 w-5" /> Export
        </button>
        <button onClick={onPrint} className="action primary">
          <Printer className="h-5 w-5" /> Print labels
        </button>
      </div>
    </div>
  );
}
