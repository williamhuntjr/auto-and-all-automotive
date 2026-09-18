export type Part = {
  id: number;
  sku: string;
  name: string;
  category: string;
  year: string;
  make: string;
  model: string;
  trim: string;
  engine: string;
  drivetrain: string;
  transmission: string;
  vin: string;
  donorStock: string;
  shelf: string;
  stock: number;
  reorder: number;
  cost: number;
  price: number;
  status: "In stock" | "Low stock" | "Out of stock";
  productionDate?: string;
  series?: string;
  bodyStyle?: string;
  vehicleType?: string;
  fuelType?: string;
  plant?: string;
  mileage?: string;
  interchangeNumber?: string;
  pictureDisplayNumber?: string;
  conditionRating?: string;
  packageWeight?: string;
  packageLength?: string;
  packageWidth?: string;
  packageHeight?: string;
  photoGallery?: string[];
  factoryColor?: string;
  paintCode?: string;
  customPaintCode?: string;
  paintSystem?: string;
  customPaintName?: string;
  customColorNumber?: string;
  additiveFormula?: string;
  paintNotes?: string;
  dataSource?: string;
};

export type ManualSheetLabel = {
  id: number;
  year: string;
  model: string;
  miles: string;
  production: string;
  color: string;
  stock: string;
  vin: string;
};

export type PrintMode =
  | "checklist"
  | "postcard"
  | "inventory-card"
  | "part-label"
  | "manual-label"
  | "part-sheet"
  | "manual-sheet";
