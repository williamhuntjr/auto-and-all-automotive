import type { PrintMode } from "./types";

/** A single vehicle record from the NHTSA vPIC decoder. */
export type VpicVehicle = Record<string, string | undefined>;

export function numericProductionDate(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length >= 6) return `${digits.slice(4, 6)}/${digits.slice(2, 4)}`;
  if (digits.length === 4) return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
  return "--/--";
}

export function abbreviateMiles(miles: string) {
  if (!miles) return "--";
  return Number(miles) >= 1000 ? `${Math.round(Number(miles) / 1000)}K` : miles;
}

export const colorAbbreviations: Record<string, string> = {
  black: "BLK",
  blue: "BLU",
  brown: "BRN",
  gold: "GLD",
  gray: "GRY",
  green: "GRN",
  orange: "ORG",
  purple: "PUR",
  red: "RED",
  silver: "SLV",
  tan: "TAN",
  white: "WHT",
  yellow: "YLW",
};

export function abbreviateColor(color: string) {
  if (!color) return "---";
  return (
    colorAbbreviations[color.trim().toLowerCase()] ||
    color.slice(0, 3).toUpperCase()
  );
}

function drivetrainFrom(driveType: string | undefined) {
  const drive = String(driveType || "").toUpperCase();
  if (drive.includes("4X4") || drive.includes("4WD")) return "4WD";
  if (drive.includes("ALL-WHEEL") || drive.includes("AWD")) return "AWD";
  if (drive.includes("FRONT-WHEEL") || drive.includes("FWD")) return "FWD";
  if (drive.includes("REAR-WHEEL") || drive.includes("RWD")) return "RWD";
  return "";
}

/** Maps a vPIC decode result onto the vehicle fields used by the add-part form. */
export function mapVpicVehicle(vehicle: VpicVehicle) {
  const speeds = vehicle.TransmissionSpeeds
    ? `${vehicle.TransmissionSpeeds}-speed `
    : "";
  return {
    year: vehicle.ModelYear || "",
    make: vehicle.Make || "",
    model: vehicle.Model || "",
    trim: vehicle.Trim || vehicle.Trim2 || vehicle.Series || "",
    series: vehicle.Series || vehicle.Series2 || "",
    engine: vehicle.DisplacementL
      ? `${vehicle.DisplacementL}L ${vehicle.EngineConfiguration || ""} ${vehicle.EngineCylinders ? `${vehicle.EngineCylinders}-cylinder` : ""}`
          .replace(/\s+/g, " ")
          .trim()
      : vehicle.EngineModel || "",
    drivetrain: drivetrainFrom(vehicle.DriveType),
    transmission: `${speeds}${vehicle.TransmissionStyle || ""}`.trim(),
    bodyStyle: vehicle.BodyClass || "",
    vehicleType: vehicle.VehicleType || "",
    fuelType: vehicle.FuelTypePrimary || "",
    plant: [
      vehicle.PlantCompanyName,
      vehicle.PlantCity,
      vehicle.PlantState,
      vehicle.PlantCountry,
    ]
      .filter(Boolean)
      .join(", "),
  };
}

const letterLandscape = "@page { size: letter landscape; margin: 0.25in; }";
const partLabel = "@page { size: 2.625in 1in; margin: 0; }";
const labelSheet = "@page { size: letter; margin: 0.5in 0.1875in; }";

/** The `@page` rule injected while printing each kind of document. */
export const printPageStyles: Record<PrintMode, string> = {
  checklist: letterLandscape,
  postcard: letterLandscape,
  "inventory-card": letterLandscape,
  "part-label": partLabel,
  "manual-label": partLabel,
  "part-sheet": labelSheet,
  "manual-sheet": labelSheet,
};
