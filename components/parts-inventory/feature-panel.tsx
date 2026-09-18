import {
  Box,
  Plus,
  QrCode,
  Share2,
  Truck,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

export function FeaturePanel({
  active,
  flash,
}: {
  active: string;
  flash: (s: string) => void;
}) {
  const content: Record<
    string,
    {
      icon: LucideIcon;
      title: string;
      description: string;
      steps: string[];
      action: string;
    }
  > = {
    Shelving: {
      icon: Warehouse,
      title: "Shelf and bin organization",
      description:
        "Assign zones, racks, shelves, and bins. Print a scannable location label so every stock movement has a recorded destination.",
      steps: [
        "Create warehouse zones",
        "Print shelf QR labels",
        "Scan part into location",
        "Run cycle counts",
      ],
      action: "Create shelf location",
    },
    "Barcode & QR": {
      icon: QrCode,
      title: "Scan, generate, and print codes",
      description:
        "Use a phone camera, USB scanner, or Bluetooth scanner to receive, find, count, and move parts. Generate Code 128 barcodes and QR labels from each SKU.",
      steps: [
        "Choose barcode format",
        "Scan supplier code",
        "Link code to SKU",
        "Print part labels",
      ],
      action: "Generate code batch",
    },
    Packing: {
      icon: Box,
      title: "Pack with accurate weight and dimensions",
      description:
        "Select the order, scan every item into the carton, record package dimensions, and capture weight from a connected digital scale or manual entry.",
      steps: [
        "Select order",
        "Scan packed items",
        "Enter L × W × H",
        "Read package weight",
      ],
      action: "Start packing order",
    },
    Shipping: {
      icon: Truck,
      title: "Rates, labels, and mailing workflow",
      description:
        "Prepare carrier-ready shipments, compare service levels, create packing slips, and print 4 × 6 shipping and return labels after a carrier account is connected.",
      steps: [
        "Validate address",
        "Compare carrier rates",
        "Buy postage",
        "Print label and packing slip",
      ],
      action: "Create shipment",
    },
    "Sales channels": {
      icon: Share2,
      title: "Publish parts without retyping",
      description:
        "Map inventory fields once, then prepare listings for an online store, marketplace, and social posts. Stock remains controlled from the inventory record.",
      steps: [
        "Choose sales channel",
        "Map title, price, photos",
        "Review listing preview",
        "Publish or schedule",
      ],
      action: "Configure a channel",
    },
  };
  const c = content[active] || content["Shelving"],
    Icon = c.icon;
  return (
    <div className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-100 text-[#1768ac]">
          <Icon className="h-7 w-7" />
        </div>
        <h2 className="mt-5 text-2xl font-black">{c.title}</h2>
        <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
          {c.description}
        </p>
        <button
          onClick={() => flash(`${c.action} workflow opened`)}
          className="action primary mt-6"
        >
          <Plus className="h-5 w-5" />
          {c.action}
        </button>
      </article>
      <article className="rounded-2xl bg-[#0d2849] p-6 text-white shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[.14em] text-blue-300">
          Workflow
        </p>
        <ol className="mt-5 space-y-4">
          {c.steps.map((x, i) => (
            <li key={x} className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#1768ac] font-black">
                {i + 1}
              </span>
              <span className="font-bold">{x}</span>
            </li>
          ))}
        </ol>
      </article>
    </div>
  );
}
