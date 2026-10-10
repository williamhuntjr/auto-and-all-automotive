/**
 * AutoEstimatingServices ↔ Auto And All integration contract.
 * Initial phase: VIN + parts summary. No database writes or public customer data.
 * Both apps may export/import this JSON explicitly until a secure API is added.
 */
export type EstimatePartReference = {
  description: string;
  partNumber?: string;
  quantity: number;
  unitPrice?: number;
  vendorUrl?: string;
  repairHours?: number;
  replaceHours?: number;
  finishHours?: number;
  notes?: string;
};

export type EstimateTransfer = {
  schema: "auto-and-all/estimate-transfer";
  version: 1;
  vehicle: {
    vin: string;
    year?: string;
    make?: string;
    model?: string;
    trim?: string;
    paintCode?: string;
  };
  parts: EstimatePartReference[];
};

export function normalizeEstimateVin(value: string): string {
  return value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "").slice(0, 17);
}

export function isEstimateTransfer(value: unknown): value is EstimateTransfer {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<EstimateTransfer>;
  return item.schema === "auto-and-all/estimate-transfer" &&
    item.version === 1 &&
    !!item.vehicle &&
    typeof item.vehicle.vin === "string" &&
    Array.isArray(item.parts) &&
    item.parts.every(part => typeof part.description === "string" &&
      Number.isFinite(part.quantity) && part.quantity >= 0);
}
