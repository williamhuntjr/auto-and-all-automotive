import Link from "next/link";
import { Box, Plus } from "lucide-react";

export function InventoryHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <header className="border-b border-white/10 bg-[#071b36] text-white">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-5 px-5 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#d62828] shadow-lg">
            <Box className="h-6 w-6" />
          </div>
          <div>
            <Link
              href="/"
              className="mb-1 inline-block text-sm font-bold text-blue-200 hover:text-white"
            >
              ← Auto And All Automotive Home
            </Link>
            <p className="text-xl font-black tracking-tight">AUTO AND ALL AUTOMOTIVE</p>
            <p className="text-sm font-medium text-blue-200">
              Automotive Parts Inventory
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-blue-300/20 bg-white/5 px-4 py-2 text-sm text-blue-100 md:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400" /> Connected to
          Auto And All Automotive
        </div>
        <button
          onClick={onAdd}
          className="flex min-h-11 items-center gap-2 rounded-xl bg-[#d62828] px-5 font-bold hover:bg-red-700"
        >
          <Plus className="h-5 w-5" /> Add automotive part
        </button>
      </div>
    </header>
  );
}
