import type { Part } from "./types";

/** Builds a new inventory record from the add-part form submission. */
export function partFromFormData(formData: FormData): Part {
  const stock = Number(formData.get("stock") || 0);
  const reorder = Number(formData.get("reorder") || 2);
  const vin = String(formData.get("vin") || "").toUpperCase();
  return {
    id: Date.now(),
    sku: String(formData.get("sku")),
    name: String(formData.get("name")),
    category: String(formData.get("category")),
    year: String(formData.get("year")),
    make: String(formData.get("make")),
    model: String(formData.get("model")),
    trim: String(formData.get("trim")),
    productionDate: String(formData.get("productionDate")),
    engine: String(formData.get("engine")),
    drivetrain: String(formData.get("drivetrain")),
    transmission: String(formData.get("transmission")),
    series: String(formData.get("series")),
    bodyStyle: String(formData.get("bodyStyle")),
    vehicleType: String(formData.get("vehicleType")),
    fuelType: String(formData.get("fuelType")),
    plant: String(formData.get("plant")),
    mileage: String(formData.get("mileage")),
    interchangeNumber: String(formData.get("interchangeNumber")),
    pictureDisplayNumber: String(formData.get("pictureDisplayNumber")),
    conditionRating: String(formData.get("conditionRating")),
    packageWeight: String(formData.get("packageWeight")),
    packageLength: String(formData.get("packageLength")),
    packageWidth: String(formData.get("packageWidth")),
    packageHeight: String(formData.get("packageHeight")),
    photoGallery: (() => {
      try {
        return JSON.parse(String(formData.get("photoGallery") || "[]"));
      } catch {
        return [];
      }
    })(),
    factoryColor: String(formData.get("factoryColor")),
    paintCode: String(formData.get("paintCode")),
    customPaintCode: String(formData.get("customPaintCode")),
    paintSystem: String(formData.get("paintSystem")),
    customPaintName: String(formData.get("customPaintName")),
    customColorNumber: String(formData.get("customColorNumber")),
    additiveFormula: String(formData.get("additiveFormula")),
    paintNotes: String(formData.get("paintNotes")),
    dataSource: String(formData.get("dataSource") || "Manual entry"),
    vin,
    donorStock: `PNC${vin.slice(-4)}`,
    shelf: String(formData.get("shelf")),
    stock,
    reorder,
    cost: Number(formData.get("cost") || 0),
    price: Number(formData.get("price") || 0),
    status:
      stock === 0
        ? "Out of stock"
        : stock <= reorder
          ? "Low stock"
          : "In stock",
  };
}
