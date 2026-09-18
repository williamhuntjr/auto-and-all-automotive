import type { Part } from "./types";
import { Metric } from "./metric";
import {
  CircleDollarSign,
  PackageCheck,
  ShoppingCart,
  SlidersHorizontal,
} from "lucide-react";

export function InventoryMetrics({ parts }: { parts: Part[] }) {
  const inventoryValue = parts.reduce(
    (sum, part) => sum + part.stock * part.cost,
    0,
  );
  const low = parts.filter((part) => part.stock <= part.reorder).length;
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Metric
        icon={PackageCheck}
        label="Units on hand"
        value={String(parts.reduce((s, p) => s + p.stock, 0))}
        note={`${parts.length} active SKUs`}
        color="blue"
      />
      <Metric
        icon={CircleDollarSign}
        label="Inventory cost"
        value={inventoryValue.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
        note="Current on-hand value"
        color="navy"
      />
      <Metric
        icon={SlidersHorizontal}
        label="Needs attention"
        value={String(low)}
        note="At or below reorder point"
        color="red"
      />
      <Metric
        icon={ShoppingCart}
        label="Ready to list"
        value={String(parts.filter((p) => p.stock > 0).length)}
        note="Eligible for sales channels"
        color="silver"
      />
    </div>
  );
}
