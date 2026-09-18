"use client";

import { useEffect, useRef, useState } from "react";
import { Link2, Plus, Printer, ScanLine } from "lucide-react";
import type { ManualSheetLabel, PrintMode } from "./types";
import { EditableChoice, FieldValue } from "./form-fields";
import { VinLabelSlots } from "./vin-label-slots";
import { vehicleModels } from "./vehicle-models";
import {
  abbreviateColor,
  abbreviateMiles,
  colorAbbreviations,
  mapVpicVehicle,
  numericProductionDate,
  printPageStyles,
  type VpicVehicle,
} from "./vehicle-utils";

export function AddPartModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (data: FormData) => void;
}) {
  const [vin, setVin] = useState(""),
    [year, setYear] = useState(""),
    [make, setMake] = useState(""),
    [model, setModel] = useState(""),
    [trim, setTrim] = useState(""),
    [engine, setEngine] = useState(""),
    [drivetrain, setDrivetrain] = useState(""),
    [transmission, setTransmission] = useState(""),
    [series, setSeries] = useState(""),
    [bodyStyle, setBodyStyle] = useState(""),
    [vehicleType, setVehicleType] = useState(""),
    [fuelType, setFuelType] = useState(""),
    [plant, setPlant] = useState(""),
    [factoryColor, setFactoryColor] = useState(""),
    [productionDate, setProductionDate] = useState(""),
    [miles, setMiles] = useState(""),
    [manualYear, setManualYear] = useState(""),
    [manualModel, setManualModel] = useState(""),
    [manualMiles, setManualMiles] = useState(""),
    [manualProductionDate, setManualProductionDate] = useState(""),
    [manualColor, setManualColor] = useState(""),
    [manualPnc, setManualPnc] = useState(""),
    [manualVin, setManualVin] = useState(""),
    [manualDecoding, setManualDecoding] = useState(false),
    [manualDecodeMessage, setManualDecodeMessage] = useState(
      "Enter all 17 VIN characters to fill year and model automatically.",
    ),
    [manualSheetLabels, setManualSheetLabels] = useState<ManualSheetLabel[]>(
      [],
    ),
    [paintCode, setPaintCode] = useState(""),
    [customPaintCode, setCustomPaintCode] = useState(""),
    [paintSystem, setPaintSystem] = useState(""),
    [customPaintName, setCustomPaintName] = useState(""),
    [customColorNumber, setCustomColorNumber] = useState(""),
    [additives, setAdditives] = useState([
      { id: 1, type: "", name: "", ounces: "" },
    ]),
    [paintNotes, setPaintNotes] = useState(""),
    [printMode, setPrintMode] = useState<PrintMode | null>(null),
    [partName, setPartName] = useState(""),
    [partSku, setPartSku] = useState(""),
    [partCategory, setPartCategory] = useState(""),
    [interchangeNumber, setInterchangeNumber] = useState(""),
    [pictureDisplayNumber, setPictureDisplayNumber] = useState(""),
    [partPhoto, setPartPhoto] = useState(""),
    [partPhotos, setPartPhotos] = useState<string[]>([]),
    [conditionRating, setConditionRating] = useState(""),
    [partShelf, setPartShelf] = useState(""),
    [partQuantity, setPartQuantity] = useState(""),
    [partReorder, setPartReorder] = useState(""),
    [partCost, setPartCost] = useState(""),
    [partPrice, setPartPrice] = useState(""),
    [packageWeight, setPackageWeight] = useState(""),
    [packageLength, setPackageLength] = useState(""),
    [packageWidth, setPackageWidth] = useState(""),
    [packageHeight, setPackageHeight] = useState(""),
    [paintChecklist, setPaintChecklist] = useState<Record<string, boolean>>({}),
    [dataSource, setDataSource] = useState("Manual entry"),
    [decoding, setDecoding] = useState(false),
    [decodeMessage, setDecodeMessage] = useState("");
  const donorStock = vin.length === 17 ? `PNC${vin.slice(-4)}` : "PNC----";
  const hasConfirmedVinDecode =
    vin.length === 17 && dataSource.startsWith("VIN confirmed");
  const decodedChecklistVin = hasConfirmedVinDecode ? vin : "";
  const decodedChecklistPnc = hasConfirmedVinDecode ? donorStock : "";
  const decodedChecklistMake = hasConfirmedVinDecode ? make : "";
  const decodedChecklistModel = hasConfirmedVinDecode ? model : "";
  const shortYear = year ? year.slice(-2) : "--";
  const shortProductionDate = numericProductionDate(productionDate);
  const compactMiles = abbreviateMiles(miles);
  const compactColor = abbreviateColor(factoryColor);
  const manualShortYear = manualYear ? manualYear.slice(-2) : "--";
  const manualShortProductionDate = numericProductionDate(manualProductionDate);
  const manualCompactMiles = abbreviateMiles(manualMiles);
  const manualCompactColor = abbreviateColor(manualColor);
  const manualStock =
    manualPnc.trim().toUpperCase() ||
    (manualVin.length === 17 ? `PNC${manualVin.slice(-4)}` : "PNC----");
  const currentManualSheetLabel: ManualSheetLabel = {
    id: Date.now(),
    year: manualShortYear,
    model: manualModel || "MODEL",
    miles: manualCompactMiles,
    production: manualShortProductionDate,
    color: manualCompactColor,
    stock: manualStock,
    vin: manualVin,
  };
  const lastDecodedVin = useRef("");
  const lastManualDecodedVin = useRef("");
  const fitmentAiUrl = `https://chatgpt.com/?q=${encodeURIComponent(
    `Find automotive parts fitment and interchange information for VIN ${vin || "not entered"}: ${year} ${make} ${model} ${trim}, engine ${engine}, ${drivetrain}, transmission ${transmission}. List likely compatible years, makes and models, OEM part-number considerations, and what must be physically verified before installation.`,
  )}`;
  const compatibleItemsAiUrl = `https://chatgpt.com/?q=${encodeURIComponent(
    `Browse current automotive interchange and compatibility sources for this inventory item. Part: ${partName || "not entered"}; SKU/OEM number: ${partSku || "not entered"}; interchange number: ${interchangeNumber || "not entered"}; donor VIN: ${vin || "not entered"}; donor vehicle: ${year} ${make} ${model} ${trim}; engine: ${engine}; drivetrain: ${drivetrain}; transmission: ${transmission}. Identify compatible years, makes, models, trims and related interchangeable item numbers. Cite current sources and clearly list anything that must be physically verified before sale or installation.`,
  )}`;
  const checklistItems = [
    "OEM paint code verified",
    "Custom paint code assigned",
    "Factory color recorded",
    "Custom paint name recorded",
    "Custom color number assigned",
    "Paint system selected",
    "All additive types entered",
    "Every additive measured in ounces",
    "Formula notes completed",
    "Test spray / color match approved",
  ];
  const printPaintRecord = (mode: PrintMode) => {
    setPrintMode(mode);
    window.setTimeout(() => {
      const pageStyle = document.createElement("style");
      pageStyle.textContent = printPageStyles[mode];
      document.head.appendChild(pageStyle);
      window.print();
      pageStyle.remove();
      setPrintMode(null);
    }, 100);
  };
  const addManualLabelToSheet = () => {
    setManualSheetLabels((labels) =>
      labels.length >= 30
        ? labels
        : [
            ...labels,
            { ...currentManualSheetLabel, id: Date.now() + labels.length },
          ],
    );
  };
  const printManualAddressSheet = () => {
    if (!manualSheetLabels.length) {
      setManualSheetLabels([{ ...currentManualSheetLabel, id: Date.now() }]);
    }
    printPaintRecord("manual-sheet");
  };
  const applyVehicle = (vehicle: VpicVehicle) => {
    const decoded = mapVpicVehicle(vehicle);
    setYear(decoded.year);
    setMake(decoded.make);
    setModel(decoded.model);
    setTrim(decoded.trim);
    setSeries(decoded.series);
    setEngine(decoded.engine);
    setDrivetrain(decoded.drivetrain);
    setTransmission(decoded.transmission);
    setBodyStyle(decoded.bodyStyle);
    setVehicleType(decoded.vehicleType);
    setFuelType(decoded.fuelType);
    setPlant(decoded.plant);
  };
  useEffect(() => {
    if (manualVin.length !== 17 || lastManualDecodedVin.current === manualVin)
      return;
    const timer = window.setTimeout(() => {
      lastManualDecodedVin.current = manualVin;
      void decodeManualVin();
    }, 450);
    return () => window.clearTimeout(timer);
    // Decode once per completed VIN; the decoder reads the latest form state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manualVin]);
  async function decodeManualVin() {
    if (manualVin.length !== 17) {
      setManualDecodeMessage("Enter all 17 VIN characters before decoding.");
      return;
    }
    setManualDecoding(true);
    setManualDecodeMessage("Checking current NHTSA VIN data…");
    try {
      const response = await fetch(
        `/api/vin?vin=${encodeURIComponent(manualVin)}`,
      );
      if (!response.ok) throw new Error("VIN service unavailable");
      const data = await response.json();
      const vehicle = data.Results?.[0];
      if (!vehicle) throw new Error("No vehicle record returned");
      if (vehicle.ModelYear) setManualYear(vehicle.ModelYear);
      if (vehicle.Model) setManualModel(vehicle.Model);
      if (!manualPnc) setManualPnc(`PNC${manualVin.slice(-4)}`);
      lastDecodedVin.current = manualVin;
      setVin(manualVin);
      applyVehicle(vehicle);
      setDataSource(
        `VIN confirmed · live NHTSA vPIC · checked ${new Date().toLocaleString()}`,
      );
      setManualDecodeMessage(
        vehicle.ModelYear || vehicle.Model
          ? `VIN decoded: ${vehicle.ModelYear || "year unavailable"} ${vehicle.Make || ""} ${vehicle.Model || "model unavailable"}. You may correct the fields manually.`
          : "The VIN was valid, but the manufacturer did not provide year or model. Select them manually.",
      );
    } catch {
      setManualDecodeMessage(
        "VIN data is unavailable right now. Select the year and model manually.",
      );
    } finally {
      setManualDecoding(false);
    }
  }
  async function decodeVin() {
    if (vin.length !== 17) {
      setDecodeMessage("Enter all 17 VIN characters before decoding.");
      return;
    }
    setDecoding(true);
    setDecodeMessage("");
    setDataSource("Checking current NHTSA vPIC data…");
    try {
      const response = await fetch(`/api/vin?vin=${encodeURIComponent(vin)}`);
      if (!response.ok) throw new Error("VIN service unavailable");
      const data = await response.json(),
        vehicle = data.Results?.[0];
      if (!vehicle) throw new Error("No vehicle record returned");
      applyVehicle(vehicle);
      setFactoryColor("");
      setPaintCode("");
      lastManualDecodedVin.current = vin;
      setManualVin(vin);
      setManualYear(vehicle.ModelYear || "");
      setManualModel(vehicle.Model || "");
      setManualPnc(`PNC${vin.slice(-4)}`);
      setDataSource(
        `VIN confirmed · live NHTSA vPIC · checked ${new Date().toLocaleString()}`,
      );
      setDecodeMessage(
        vehicle.Make && vehicle.Model
          ? `Decoded from current manufacturer-submitted data: ${vehicle.ModelYear || ""} ${vehicle.Make} ${vehicle.Model}`
          : "VIN was checked, but some fields were not supplied by the manufacturer. Complete them manually.",
      );
    } catch {
      setDataSource("Manual entry · VIN service unavailable");
      setDecodeMessage(
        "VIN could not be decoded right now. You can still select all vehicle details manually.",
      );
    } finally {
      setDecoding(false);
    }
  }
  return (
    <div
      className="fixed inset-0 z-40 grid place-items-center bg-[#071b36]/70 p-4"
      onMouseDown={onClose}
    >
      <form
        action={onSave}
        onMouseDown={(e) => e.stopPropagation()}
        className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-[#1768ac]">
              Automotive inventory record
            </p>
            <h2 className="text-2xl font-black">Add part from donor vehicle</h2>
          </div>
          <button type="button" onClick={onClose} className="text-2xl">
            ×
          </button>
        </div>
        <section className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex-1 font-bold text-slate-700">
              17-character VIN
              <input
                name="vin"
                value={vin}
                onChange={(e) => {
                  const nextVin = e.target.value
                    .toUpperCase()
                    .replace(/[^A-HJ-NPR-Z0-9]/g, "")
                    .slice(0, 17);
                  setVin(nextVin);
                  lastDecodedVin.current = "";
                  setDataSource("Manual entry");
                  setDecodeMessage(
                    nextVin.length === 17
                      ? "VIN ready. Select Decode VIN & Attach Donor."
                      : `Enter ${17 - nextVin.length} more VIN character${17 - nextVin.length === 1 ? "" : "s"}.`,
                  );
                }}
                required
                minLength={17}
                maxLength={17}
                className="field mt-2 font-mono uppercase"
                placeholder="Enter or scan VIN"
              />
            </label>
            <div className="flex items-end">
              <button
                type="button"
                onClick={decodeVin}
                disabled={decoding || vin.length !== 17}
                className="action primary w-full disabled:opacity-60 sm:w-auto"
              >
                <ScanLine className="h-5 w-5" />
                {decoding ? "Decoding…" : "Decode VIN & Attach Donor"}
              </button>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p
              className={`text-sm font-semibold ${decodeMessage.startsWith("Decoded") ? "text-emerald-700" : "text-slate-600"}`}
            >
              {decodeMessage ||
                "Enter all 17 VIN characters, then select Decode VIN & Attach Donor."}
            </p>
            <div className="rounded-lg bg-white px-3 py-2 font-mono font-black text-[#0d5796]">
              Donor stock (automatic): {donorStock}
            </div>
          </div>
          <p className="mt-2 text-xs font-semibold text-slate-600">
            Format: PNC followed by the last four digits of the 17-character
            VIN.
          </p>
        </section>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <EditableChoice
            name="year"
            label="Year"
            value={year}
            onChange={setYear}
            options={Array.from({ length: 70 }, (_, index) =>
              String(new Date().getFullYear() + 1 - index),
            )}
            required
          />
          <EditableChoice
            name="make"
            label="Make"
            value={make}
            onChange={setMake}
            options={Object.keys(vehicleModels)}
            required
          />
          <EditableChoice
            name="model"
            label="Model"
            value={model}
            onChange={setModel}
            options={
              vehicleModels[make] ||
              Array.from(new Set(Object.values(vehicleModels).flat())).sort()
            }
            required
          />
          <EditableChoice
            name="trim"
            label="Trim"
            value={trim}
            onChange={setTrim}
            options={[
              "Base",
              "S",
              "XE",
              "LS",
              "SE",
              "SEL",
              "Sport",
              "LX",
              "EX",
              "EX-L",
              "Touring",
              "LE",
              "XLE",
              "XSE",
              "LT",
              "LTZ",
              "SV",
              "SL",
              "XLT",
              "Limited",
              "Premium",
            ]}
          />
          <label className="font-bold text-slate-700">
            Production date
            <input
              name="productionDate"
              type="month"
              value={productionDate}
              onChange={(event) => setProductionDate(event.target.value)}
              className="field mt-2 font-normal"
            />
            <span className="mt-1 block text-xs font-normal text-slate-500">
              The small label prints digits only as MM/YY, for example 07/09.
            </span>
          </label>
          <label className="font-bold text-slate-700">
            Donor mileage
            <input
              name="mileage"
              type="number"
              min="0"
              value={miles}
              onChange={(event) => setMiles(event.target.value)}
              className="field mt-2 font-normal"
              placeholder="Example: 125400"
            />
          </label>
          <EditableChoice
            name="engine"
            label="Engine size"
            value={engine}
            onChange={setEngine}
            options={[
              "1.0L I3",
              "1.3L I4",
              "1.5L I4",
              "1.5L Turbo I4",
              "1.6L I4",
              "1.8L I4",
              "2.0L I4",
              "2.0L Turbo I4",
              "2.4L I4",
              "2.5L I4",
              "2.7L V6",
              "3.0L V6",
              "3.5L V6",
              "3.6L V6",
              "4.0L V6",
              "4.6L V8",
              "5.0L V8",
              "5.3L V8",
              "5.7L V8",
              "6.2L V8",
              "Hybrid",
              "Electric",
            ]}
          />
          <EditableChoice
            name="drivetrain"
            label="Drivetrain"
            value={drivetrain}
            onChange={setDrivetrain}
            options={["FWD", "RWD", "AWD", "4WD", "4x2", "4x4"]}
          />
          <EditableChoice
            name="transmission"
            label="Transmission"
            value={transmission}
            onChange={setTransmission}
            options={[
              "CVT",
              "Automatic",
              "4-speed automatic",
              "5-speed automatic",
              "6-speed automatic",
              "8-speed automatic",
              "9-speed automatic",
              "10-speed automatic",
              "Manual",
              "5-speed manual",
              "6-speed manual",
              "Dual-clutch",
              "Single-speed EV",
            ]}
          />
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 lg:col-span-2">
            <p className="text-sm font-black text-[#0d5796]">
              AI fitment & interchange
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Send the VIN, trim, engine, drivetrain and transmission to an
              AI-assisted interchange search.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={fitmentAiUrl}
                target="_blank"
                rel="noreferrer"
                className="action primary"
              >
                <Link2 className="h-4 w-4" /> Ask AI for interchange
              </a>
              <a
                href="https://vpic.nhtsa.dot.gov/decoder/"
                target="_blank"
                rel="noreferrer"
                className="action secondary"
              >
                Open NHTSA VIN source
              </a>
            </div>
            <p className="mt-2 text-xs font-semibold text-amber-800">
              AI results are leads only. Verify the OEM part number, connector,
              dimensions, options and production date before sale or
              installation.
            </p>
          </div>
        </div>
        <section className="mt-5 rounded-2xl border border-slate-300 bg-white p-4">
          <label className="mb-4 block max-w-sm font-bold text-slate-700">
            Printer destination
            <select className="field mt-2 font-normal" defaultValue="system">
              <option value="system">
                Choose installed printer in system dialog
              </option>
              <option value="label">
                Address-label printer — choose in system dialog
              </option>
              <option value="pdf">Save as PDF — choose in system dialog</option>
            </select>
            <span className="mt-1 block text-xs font-normal text-slate-500">
              Prints one 30-label page by default. Choose additional Copies in
              the computer&apos;s printer menu.
            </span>
          </label>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-black text-slate-900">
                1 × 2⅝ in. donor parts label
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Automatically uses the donor vehicle details above.
              </p>
            </div>
            <button
              type="button"
              onClick={() => printPaintRecord("part-sheet")}
              className="action primary"
            >
              <Printer className="h-5 w-5" /> Print 30 Address Labels
            </button>
          </div>
          <div
            className="part-label-preview mt-4"
            aria-label="Small donor parts label preview"
          >
            <div className="part-label-row part-label-main">
              <b>{shortYear}</b>
              <b>{model || "MODEL"}</b>
              <b>{compactMiles} MI</b>
            </div>
            <div className="part-label-row part-label-details">
              <b>PROD {shortProductionDate}</b>
              <b>CLR {compactColor}</b>
            </div>
            <div className="part-label-row part-label-id">
              <b>{donorStock}</b>
            </div>
            <VinLabelSlots vin={vin} />
          </div>
          <p className="mt-2 text-xs font-semibold text-slate-500">
            Prints one 30-label sheet per click. For more sheets, change Copies
            in the computer&apos;s print dialog. Print at 100% scale.
          </p>
          <div className="mt-5 border-t border-slate-200 pt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-black text-slate-900">
                  Manual small-label entry
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Use this short form when you do not want to load the full
                  donor record.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={addManualLabelToSheet}
                  disabled={manualSheetLabels.length >= 30}
                  className="action secondary disabled:opacity-50"
                >
                  <Plus className="h-5 w-5" /> Add label to sheet
                </button>
                <button
                  type="button"
                  onClick={printManualAddressSheet}
                  className="action primary"
                >
                  <Printer className="h-5 w-5" /> Print 30 Address Labels
                </button>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="font-bold text-slate-700">
                Year
                <select
                  value={manualYear}
                  onChange={(event) => setManualYear(event.target.value)}
                  className="field mt-2 font-normal"
                >
                  <option value="">Year</option>
                  {Array.from({ length: 60 }, (_, index) =>
                    String(2026 - index),
                  ).map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label className="font-bold text-slate-700">
                Model
                <select
                  value={manualModel}
                  onChange={(event) => setManualModel(event.target.value)}
                  className="field mt-2 font-normal"
                >
                  <option value="">Model</option>
                  {Array.from(new Set(Object.values(vehicleModels).flat()))
                    .sort()
                    .map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  {manualModel &&
                    !Object.values(vehicleModels)
                      .flat()
                      .includes(manualModel) && <option>{manualModel}</option>}
                </select>
              </label>
              <label className="font-bold text-slate-700">
                Miles
                <input
                  type="number"
                  min="0"
                  value={manualMiles}
                  onChange={(event) => setManualMiles(event.target.value)}
                  className="field mt-2 font-normal"
                  placeholder="125400"
                />
              </label>
              <label className="font-bold text-slate-700">
                Production date
                <input
                  type="month"
                  value={manualProductionDate}
                  onChange={(event) =>
                    setManualProductionDate(event.target.value)
                  }
                  className="field mt-2 font-normal"
                />
                <span className="mt-1 block text-xs font-normal text-slate-500">
                  Label format: MM/YY
                </span>
              </label>
              <label className="font-bold text-slate-700">
                Color
                <select
                  value={manualColor}
                  onChange={(event) => setManualColor(event.target.value)}
                  className="field mt-2 font-normal"
                >
                  <option value="">Color</option>
                  {Object.keys(colorAbbreviations).map((item) => (
                    <option key={item} value={item}>
                      {item.charAt(0).toUpperCase() + item.slice(1)} (
                      {colorAbbreviations[item]})
                    </option>
                  ))}
                </select>
              </label>
              <label className="font-bold text-slate-700">
                PNC stock number
                <input
                  value={manualPnc}
                  onChange={(event) =>
                    setManualPnc(
                      event.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9-]/g, ""),
                    )
                  }
                  className="field mt-2 font-mono uppercase"
                  placeholder="PNC----"
                />
              </label>
              <label className="font-bold text-slate-700 sm:col-span-2">
                17-character VIN
                <input
                  value={manualVin}
                  onChange={(event) => {
                    const nextVin = event.target.value
                      .toUpperCase()
                      .replace(/[^A-HJ-NPR-Z0-9]/g, "")
                      .slice(0, 17);
                    setManualVin(nextVin);
                    setManualDecodeMessage(
                      nextVin.length === 17
                        ? "Preparing to decode VIN…"
                        : "Enter all 17 VIN characters to fill year and model automatically.",
                    );
                    if (nextVin.length === 17 && !manualPnc)
                      setManualPnc(`PNC${nextVin.slice(-4)}`);
                  }}
                  minLength={17}
                  maxLength={17}
                  className="field mt-2 font-mono uppercase tracking-widest"
                  placeholder="-----------------"
                  aria-label="Manual 17-character VIN"
                />
                <span className="mt-1 block font-mono text-xs font-normal tracking-widest text-slate-500">
                  {manualVin.padEnd(17, "-")}
                </span>
              </label>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={decodeManualVin}
                disabled={manualDecoding || manualVin.length !== 17}
                className="action secondary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ScanLine className="h-4 w-4" />
                {manualDecoding ? "Decoding…" : "Decode manual VIN"}
              </button>
              <p
                className="text-sm font-semibold text-slate-600"
                aria-live="polite"
              >
                {manualDecodeMessage}
              </p>
            </div>
            <div
              className="part-label-preview mt-4"
              aria-label="Manual small donor parts label preview"
            >
              <div className="part-label-row part-label-main">
                <b>{manualShortYear}</b>
                <b>{manualModel || "MODEL"}</b>
                <b>{manualCompactMiles} MI</b>
              </div>
              <div className="part-label-row part-label-details">
                <b>PROD {manualShortProductionDate}</b>
                <b>CLR {manualCompactColor}</b>
              </div>
              <div className="part-label-row part-label-id">
                <b>{manualStock}</b>
              </div>
              <VinLabelSlots vin={manualVin} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <b className="text-sm text-[#0d5796]">
                {manualSheetLabels.length} of 30 labels queued
              </b>
              {manualSheetLabels.length > 0 && (
                <button
                  type="button"
                  onClick={() => setManualSheetLabels([])}
                  className="text-sm font-black text-red-700 underline"
                >
                  Clear sheet
                </button>
              )}
              <span className="text-xs font-semibold text-slate-500">
                Prints exactly one 30-position address-label sheet per click.
                Unused positions stay blank; select extra copies only in the
                computer&apos;s print dialog.
              </span>
            </div>
          </div>
        </section>
        <section className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-black text-slate-800">VIN data relationship</p>
              <p className="mt-1 text-sm text-slate-600">{dataSource}</p>
            </div>
            <a
              href="https://vpic.nhtsa.dot.gov/api/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-100 px-3 py-2 text-sm font-bold text-emerald-800"
            >
              <Link2 className="h-4 w-4" /> Current data source
            </a>
          </div>
          <input type="hidden" name="dataSource" value={dataSource} />
          <input
            type="hidden"
            name="photoGallery"
            value={JSON.stringify(partPhotos)}
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <FieldValue
              name="series"
              label="Series"
              value={series}
              onChange={setSeries}
            />
            <FieldValue
              name="bodyStyle"
              label="Body style"
              value={bodyStyle}
              onChange={setBodyStyle}
            />
            <FieldValue
              name="vehicleType"
              label="Vehicle type"
              value={vehicleType}
              onChange={setVehicleType}
            />
            <FieldValue
              name="fuelType"
              label="Fuel type"
              value={fuelType}
              onChange={setFuelType}
            />
            <FieldValue
              name="plant"
              label="Assembly plant"
              value={plant}
              onChange={setPlant}
            />
          </div>
        </section>
        <section className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="font-black text-amber-900">
            OEM and custom paint record
          </p>
          <p className="mt-1 text-sm text-amber-800">
            Record the factory label information and the shop’s custom mix
            separately. Public VIN data normally does not include factory paint.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <FieldValue
              name="paintCode"
              label="OEM paint code"
              value={paintCode}
              onChange={setPaintCode}
            />
            <FieldValue
              name="customPaintCode"
              label="Custom paint code"
              value={customPaintCode}
              onChange={setCustomPaintCode}
            />
            <FieldValue
              name="factoryColor"
              label="Factory color name"
              value={factoryColor}
              onChange={setFactoryColor}
            />
            <label className="font-bold text-slate-700">
              Paint system
              <select
                name="paintSystem"
                value={paintSystem}
                onChange={(event) => setPaintSystem(event.target.value)}
                className="field mt-2 font-normal"
              >
                <option value="">Select system</option>
                {[
                  "Single stage",
                  "Base coat / clear coat",
                  "Three-stage",
                  "Pearl",
                  "Candy",
                  "Chameleon / color shift",
                  "Flip-flop",
                  "Matte / satin",
                  "Custom multi-stage",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <FieldValue
              name="customPaintName"
              label="Our custom paint name"
              value={customPaintName}
              onChange={setCustomPaintName}
            />
            <FieldValue
              name="customColorNumber"
              label="Our color number"
              value={customColorNumber}
              onChange={setCustomColorNumber}
            />
          </div>
          <div className="mt-5 rounded-xl border border-amber-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-black text-slate-800">
                  Custom additive formula
                </p>
                <p className="text-sm text-slate-500">
                  Enter every additive and its measured ounces.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setAdditives((rows) => [
                    ...rows,
                    { id: Date.now(), type: "", name: "", ounces: "" },
                  ])
                }
                className="action secondary"
              >
                <Plus className="h-4 w-4" /> Add formula line
              </button>
            </div>
            <input
              type="hidden"
              name="additiveFormula"
              value={JSON.stringify(
                additives.map(({ type, name, ounces }) => ({
                  type,
                  name,
                  ounces,
                })),
              )}
            />
            <div className="mt-3 space-y-3">
              {additives.map((row, index) => (
                <div
                  key={row.id}
                  className="grid gap-3 rounded-xl bg-slate-50 p-3 sm:grid-cols-[1.1fr_1.4fr_.7fr_auto]"
                >
                  <label className="font-bold text-slate-700">
                    Additive type
                    <select
                      value={row.type}
                      onChange={(event) =>
                        setAdditives((rows) =>
                          rows.map((item) =>
                            item.id === row.id
                              ? { ...item, type: event.target.value }
                              : item,
                          ),
                        )
                      }
                      className="field mt-2 font-normal"
                    >
                      <option value="">Select type</option>
                      {[
                        "Glitter",
                        "Pearl",
                        "Mica",
                        "Matte additive",
                        "Flop controller",
                        "Metallic toner",
                        "Candy concentrate",
                        "Binder",
                        "Reducer",
                        "Hardener",
                        "Custom additive",
                      ].map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </label>
                  <label className="font-bold text-slate-700">
                    Additive / toner name
                    <input
                      value={row.name}
                      onChange={(event) =>
                        setAdditives((rows) =>
                          rows.map((item) =>
                            item.id === row.id
                              ? { ...item, name: event.target.value }
                              : item,
                          ),
                        )
                      }
                      className="field mt-2 font-normal"
                      placeholder="Brand, toner or product number"
                    />
                  </label>
                  <label className="font-bold text-slate-700">
                    Ounces
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={row.ounces}
                      onChange={(event) =>
                        setAdditives((rows) =>
                          rows.map((item) =>
                            item.id === row.id
                              ? { ...item, ounces: event.target.value }
                              : item,
                          ),
                        )
                      }
                      className="field mt-2 font-normal"
                      placeholder="0.00"
                    />
                  </label>
                  <button
                    type="button"
                    aria-label={`Remove formula line ${index + 1}`}
                    disabled={additives.length === 1}
                    onClick={() =>
                      setAdditives((rows) =>
                        rows.filter((item) => item.id !== row.id),
                      )
                    }
                    className="mt-8 h-12 rounded-lg border border-red-200 bg-red-50 px-4 font-black text-red-700 disabled:opacity-30"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <label className="mt-4 block font-bold text-slate-700">
              Formula notepad
              <textarea
                name="paintNotes"
                value={paintNotes}
                onChange={(event) => setPaintNotes(event.target.value)}
                className="mt-2 min-h-32 w-full rounded-xl border border-slate-300 bg-white p-3 font-normal outline-none focus:border-[#1768ac]"
                placeholder="Spray-gun setup, reducer temperature, flash time, test-panel results, repair notes, corrections or future mix instructions…"
              />
            </label>
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-black text-slate-800">
                Paint record summary checklist
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {checklistItems.map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(paintChecklist[item])}
                      onChange={(event) =>
                        setPaintChecklist((current) => ({
                          ...current,
                          [item]: event.target.checked,
                        }))
                      }
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => printPaintRecord("checklist")}
                className="action primary"
              >
                <Printer className="h-5 w-5" /> Print checklist
              </button>
              <button
                type="button"
                onClick={() => printPaintRecord("postcard")}
                className="action primary"
              >
                <Printer className="h-5 w-5" /> Paint Codes and Formulas
              </button>
            </div>
            <p className="mt-2 text-xs font-semibold text-slate-500">
              Prints exactly one full letter-size landscape page by default. To
              print more, choose the number of Copies in the computer&apos;s
              printer menu.
            </p>
          </div>
        </section>
        <section
          className={`print-document checklist-page ${printMode === "checklist" ? "print-active" : ""}`}
        >
          <div className="print-heading">
            <strong>AUTO AND ALL AUTOMOTIVE</strong>
            <span>Custom Paint Record Checklist</span>
          </div>
          <div className="checklist-identity">
            <div>
              <small>PNC STOCK NUMBER · FROM VIN</small>
              <b>{decodedChecklistPnc}</b>
            </div>
            <div>
              <small>VIN NUMBER · DECODE CONFIRMED</small>
              <b>{decodedChecklistVin}</b>
            </div>
            <div>
              <small>MAKE · FROM VIN</small>
              <b>{decodedChecklistMake}</b>
            </div>
            <div>
              <small>MODEL · FROM VIN</small>
              <b>{decodedChecklistModel}</b>
            </div>
          </div>
          <div className="checklist-paint-fields">
            <div>
              <small>PAINT SYSTEM</small>
              <b>{paintSystem}</b>
            </div>
            <div>
              <small>OEM PAINT CODE</small>
              <b>{paintCode}</b>
            </div>
            <div>
              <small>CUSTOM PAINT CODE</small>
              <b>{customPaintCode}</b>
            </div>
            <div>
              <small>FACTORY COLOR</small>
              <b>{factoryColor}</b>
            </div>
            <div>
              <small>CUSTOM PAINT NAME</small>
              <b>{customPaintName}</b>
            </div>
            <div>
              <small>COLOR NUMBER</small>
              <b>{customColorNumber}</b>
            </div>
          </div>
          <div className="checklist-body">
            <div className="checklist-list">
              <h3>Fillable Summary Checklist</h3>
              {checklistItems.map((item) => (
                <p key={item} className="print-check">
                  {paintChecklist[item] ? "☑" : "☐"} {item}
                </p>
              ))}
            </div>
            <div className="checklist-formula">
              <h3>Additive Formula</h3>
              <table className="print-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Additive / toner</th>
                    <th>Ounces</th>
                    <th>Checked</th>
                  </tr>
                </thead>
                <tbody>
                  {additives.map((row) => (
                    <tr key={row.id}>
                      <td>{row.type}</td>
                      <td>{row.name}</td>
                      <td>{row.ounces}</td>
                      <td>☐</td>
                    </tr>
                  ))}
                  {Array.from(
                    { length: Math.max(1, 4 - additives.length) },
                    (_, index) => (
                      <tr key={`empty-checklist-${index}`}>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>☐</td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="checklist-notes">
            <b>FORMULA NOTES / SPRAY SETTINGS / CORRECTIONS</b>
            <p>{paintNotes}</p>
          </div>
          <div className="print-sign">
            <span>MIXED BY: ____________________</span>
            <span>DATE: __________</span>
            <span>TEST PANEL: ☐ PASS ☐ ADJUST</span>
            <span>APPROVED: ____________________</span>
          </div>
        </section>
        <section
          className={`print-document postcard-sheet ${printMode === "postcard" ? "print-active" : ""}`}
        >
          <div className="postcard full-paint-card">
            <div className="postcard-top">
              <div>
                <strong>AUTO AND ALL AUTOMOTIVE</strong>
                <p>Paint Codes and Formulas</p>
              </div>
              <b>{donorStock}</b>
            </div>
            <div className="paint-card-vehicle">
              <div>
                <small>MAKE AND MODEL · AUTOMATIC FROM VIN</small>
                <b>
                  {make} {model}
                </b>
              </div>
              <div>
                <small>VIN NUMBER · AUTOMATIC</small>
                <b>{vin}</b>
              </div>
            </div>
            <div className="postcard-codes">
              <div>
                <small>OEM PAINT CODE</small>
                <b>{paintCode || ""}</b>
              </div>
              <div>
                <small>CUSTOM PAINT CODE</small>
                <b>{customPaintCode || ""}</b>
              </div>
              <div>
                <small>PAINT SYSTEM</small>
                <b>{paintSystem || ""}</b>
              </div>
              <div>
                <small>COLOR NUMBER</small>
                <b>{customColorNumber || ""}</b>
              </div>
            </div>
            <div className="paint-card-names">
              <div>
                <small>CUSTOM PAINT NAME</small>
                <b>{customPaintName || ""}</b>
              </div>
              <div>
                <small>FACTORY COLOR</small>
                <b>{factoryColor || ""}</b>
              </div>
            </div>
            <table className="print-table formula-table">
              <thead>
                <tr>
                  <th>ADDITIVE TYPE</th>
                  <th>PRODUCT / TONER</th>
                  <th>OUNCES</th>
                  <th>HANDWRITTEN ADJUSTMENT</th>
                </tr>
              </thead>
              <tbody>
                {additives.map((row) => (
                  <tr key={row.id}>
                    <td>{row.type}</td>
                    <td>{row.name}</td>
                    <td>{row.ounces}</td>
                    <td></td>
                  </tr>
                ))}
                {Array.from(
                  { length: Math.max(2, 5 - additives.length) },
                  (_, index) => (
                    <tr key={`empty-formula-${index}`}>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
            <div className="paint-card-notes">
              <small>FORMULA NOTES / SPRAY SETTINGS / CORRECTIONS</small>
              <p>{paintNotes}</p>
            </div>
            <div className="paint-card-sign">
              <span>MIXED BY: ____________________</span>
              <span>DATE: __________</span>
              <span>TEST PANEL: ☐ PASS ☐ ADJUST</span>
              <span>APPROVED: ____________________</span>
            </div>
          </div>
        </section>
        <section
          className={`print-document part-label-print ${printMode === "part-label" ? "print-active" : ""}`}
        >
          <div className="part-label-row part-label-main">
            <b>{shortYear}</b>
            <b>{model || "MODEL"}</b>
            <b>{compactMiles} MI</b>
          </div>
          <div className="part-label-row part-label-details">
            <b>PROD {shortProductionDate}</b>
            <b>CLR {compactColor}</b>
          </div>
          <div className="part-label-row part-label-id">
            <b>{donorStock}</b>
          </div>
          <VinLabelSlots vin={vin} />
        </section>
        <section
          className={`print-document manual-sheet ${printMode === "part-sheet" ? "print-active" : ""}`}
        >
          <div className="address-sheet-page">
            {Array.from({ length: 30 }, (_, index) => (
              <div className="sheet-label part-label-print" key={index}>
                <div className="part-label-row part-label-main">
                  <b>{shortYear}</b>
                  <b>{model || "MODEL"}</b>
                  <b>{compactMiles} MI</b>
                </div>
                <div className="part-label-row part-label-details">
                  <b>PROD {shortProductionDate}</b>
                  <b>CLR {compactColor}</b>
                </div>
                <div className="part-label-row part-label-id">
                  <b>{donorStock}</b>
                </div>
                <VinLabelSlots vin={vin} />
              </div>
            ))}
          </div>
        </section>
        <section
          className={`print-document part-label-print ${printMode === "manual-label" ? "print-active" : ""}`}
        >
          <div className="part-label-row part-label-main">
            <b>{manualShortYear}</b>
            <b>{manualModel || "MODEL"}</b>
            <b>{manualCompactMiles} MI</b>
          </div>
          <div className="part-label-row part-label-details">
            <b>PROD {manualShortProductionDate}</b>
            <b>CLR {manualCompactColor}</b>
          </div>
          <div className="part-label-row part-label-id">
            <b>{manualStock}</b>
          </div>
          <VinLabelSlots vin={manualVin} />
        </section>
        <section
          className={`print-document manual-sheet ${printMode === "manual-sheet" ? "print-active" : ""}`}
        >
          <div className="address-sheet-page">
            {Array.from({ length: 30 }, (_, index) => {
              const labels = manualSheetLabels.length
                ? manualSheetLabels
                : [currentManualSheetLabel];
              const label = labels[index];
              return label ? (
                <div className="sheet-label part-label-print" key={label.id}>
                  <div className="part-label-row part-label-main">
                    <b>{label.year}</b>
                    <b>{label.model}</b>
                    <b>{label.miles} MI</b>
                  </div>
                  <div className="part-label-row part-label-details">
                    <b>PROD {label.production}</b>
                    <b>CLR {label.color}</b>
                  </div>
                  <div className="part-label-row part-label-id">
                    <b>{label.stock}</b>
                  </div>
                  <VinLabelSlots vin={label.vin} />
                </div>
              ) : (
                <div
                  className="sheet-label part-label-print"
                  key={`blank-label-${index}`}
                  aria-hidden="true"
                />
              );
            })}
          </div>
        </section>
        <section
          className={`print-document inventory-card-print ${printMode === "inventory-card" ? "print-active" : ""}`}
        >
          <div className="inventory-card-heading">
            <div>
              <strong>AUTO AND ALL AUTOMOTIVE</strong>
              <span>Automotive Parts Inventory Card</span>
            </div>
            <b>{donorStock}</b>
          </div>
          <div className="inventory-card-primary">
            <div>
              <small>PART NAME</small>
              <b>{partName}</b>
            </div>
            <div>
              <small>SKU / PART NUMBER</small>
              <b>{partSku}</b>
            </div>
            <div>
              <small>PNC STOCK NUMBER</small>
              <b>{donorStock}</b>
            </div>
            <div>
              <small>INTERCHANGE NUMBER</small>
              <b>{interchangeNumber}</b>
            </div>
            <div>
              <small>PICTURE DISPLAY NUMBER</small>
              <b>{pictureDisplayNumber}</b>
            </div>
            <div>
              <small>CONDITION</small>
              <b>{conditionRating ? `${conditionRating} / 10` : ""}</b>
            </div>
          </div>
          <div className="inventory-card-grid">
            <div>
              <small>VIN NUMBER</small>
              <b>{vin}</b>
            </div>
            <div>
              <small>YEAR</small>
              <b>{year}</b>
            </div>
            <div>
              <small>MAKE</small>
              <b>{make}</b>
            </div>
            <div>
              <small>MODEL</small>
              <b>{model}</b>
            </div>
            <div>
              <small>TRIM</small>
              <b>{trim}</b>
            </div>
            <div>
              <small>SERIES</small>
              <b>{series}</b>
            </div>
            <div>
              <small>VEHICLE TYPE</small>
              <b>{vehicleType}</b>
            </div>
            <div>
              <small>PRODUCTION DATE</small>
              <b>{numericProductionDate(productionDate)}</b>
            </div>
            <div>
              <small>ENGINE</small>
              <b>{engine}</b>
            </div>
            <div>
              <small>DRIVETRAIN</small>
              <b>{drivetrain}</b>
            </div>
            <div>
              <small>TRANSMISSION</small>
              <b>{transmission}</b>
            </div>
            <div>
              <small>BODY STYLE</small>
              <b>{bodyStyle}</b>
            </div>
            <div>
              <small>FUEL TYPE</small>
              <b>{fuelType}</b>
            </div>
            <div>
              <small>ASSEMBLY PLANT</small>
              <b>{plant}</b>
            </div>
            <div>
              <small>FACTORY COLOR</small>
              <b>{factoryColor}</b>
            </div>
            <div>
              <small>DONOR MILEAGE</small>
              <b>{miles}</b>
            </div>
            <div>
              <small>CATEGORY</small>
              <b>{partCategory}</b>
            </div>
            <div>
              <small>SHELF / RACK / BIN</small>
              <b>{partShelf}</b>
            </div>
            <div>
              <small>QUANTITY / REORDER</small>
              <b>
                {partQuantity}
                {partReorder ? ` / ${partReorder}` : ""}
              </b>
            </div>
            <div>
              <small>COST / RETAIL PRICE</small>
              <b>
                {partCost ? `$${partCost}` : ""}
                {partPrice ? ` / $${partPrice}` : ""}
              </b>
            </div>
            <div>
              <small>PACKAGE WEIGHT (LB)</small>
              <b>{packageWeight}</b>
            </div>
            <div>
              <small>PACKAGE LENGTH (IN)</small>
              <b>{packageLength}</b>
            </div>
            <div>
              <small>PACKAGE WIDTH (IN)</small>
              <b>{packageWidth}</b>
            </div>
            <div>
              <small>PACKAGE HEIGHT (IN)</small>
              <b>{packageHeight}</b>
            </div>
          </div>
          <div className="inventory-card-bottom">
            <div className="inventory-card-notes">
              <small>CONDITION / FITMENT / SHIPPING / HANDWRITTEN NOTES</small>
            </div>
            <div className="inventory-photo-area">
              <small>JPEG PHOTO GALLERY</small>
              {partPhotos.length ? (
                <div className="inventory-print-gallery">
                  {partPhotos.slice(0, 4).map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Selected automotive part ${index + 1}`}
                    />
                  ))}
                </div>
              ) : partPhoto ? (
                <img src={partPhoto} alt="Selected automotive part" />
              ) : (
                <span>PHOTO AREA</span>
              )}
            </div>
            <div className="inventory-code-area">
              <div>
                <small>QR CODE AREA</small>
                <span>PLACE OR PRINT QR CODE HERE</span>
              </div>
              <div>
                <small>BARCODE AREA</small>
                <span>{partSku || donorStock}</span>
                <i aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </section>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <FieldValue
            name="name"
            label="Part name"
            value={partName}
            onChange={setPartName}
            required
          />
          <FieldValue
            name="sku"
            label="SKU / part number"
            value={partSku}
            onChange={setPartSku}
            required
          />
          <FieldValue
            name="interchangeNumber"
            label="Interchange number"
            value={interchangeNumber}
            onChange={setInterchangeNumber}
          />
          <FieldValue
            name="pictureDisplayNumber"
            label="Picture display number"
            value={pictureDisplayNumber}
            onChange={setPictureDisplayNumber}
          />
          <label className="font-bold text-slate-700">
            Condition rating
            <select
              name="conditionRating"
              value={conditionRating}
              onChange={(event) => setConditionRating(event.target.value)}
              className="field mt-2 font-normal"
            >
              <option value="">Select condition</option>
              {Array.from({ length: 10 }, (_, index) => String(10 - index)).map(
                (rating) => (
                  <option key={rating} value={rating}>
                    {rating} / 10
                    {rating === "10"
                      ? " — Excellent"
                      : rating === "1"
                        ? " — Poor"
                        : ""}
                  </option>
                ),
              )}
            </select>
          </label>
          <label className="font-bold text-slate-700">
            Automotive category
            <select
              name="category"
              value={partCategory}
              onChange={(event) => setPartCategory(event.target.value)}
              required
              className="field mt-2 font-normal"
            >
              <option value="">Select category</option>
              {[
                "Body & exterior",
                "Air conditioning & heating",
                "Air bags & safety restraints",
                "Audio, navigation & electronics",
                "Brakes",
                "Cooling",
                "Drivetrain",
                "Electrical",
                "Engine",
                "Engine accessories",
                "Exhaust & emissions",
                "Glass",
                "Interior",
                "Lighting",
                "Mirrors",
                "Steering",
                "Suspension",
                "Transmission & transfer case",
                "Truck bed & cargo",
                "Weatherstrip & seals",
                "Wheels & tires",
              ].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <FieldValue
            name="shelf"
            label="Shelf / rack / bin"
            value={partShelf}
            onChange={setPartShelf}
            required
          />
          <FieldValue
            name="stock"
            label="Starting quantity"
            value={partQuantity}
            onChange={setPartQuantity}
            type="number"
          />
          <FieldValue
            name="reorder"
            label="Reorder point"
            value={partReorder}
            onChange={setPartReorder}
            type="number"
          />
          <FieldValue
            name="cost"
            label="Unit cost ($)"
            value={partCost}
            onChange={setPartCost}
            type="number"
          />
          <FieldValue
            name="price"
            label="Retail price ($)"
            value={partPrice}
            onChange={setPartPrice}
            type="number"
          />
          <FieldValue
            name="packageWeight"
            label="Package weight (lb)"
            value={packageWeight}
            onChange={setPackageWeight}
            type="number"
          />
          <FieldValue
            name="packageLength"
            label="Package length (in)"
            value={packageLength}
            onChange={setPackageLength}
            type="number"
          />
          <FieldValue
            name="packageWidth"
            label="Package width (in)"
            value={packageWidth}
            onChange={setPackageWidth}
            type="number"
          />
          <FieldValue
            name="packageHeight"
            label="Package height (in)"
            value={packageHeight}
            onChange={setPackageHeight}
            type="number"
          />
          <label className="font-bold text-slate-700 sm:col-span-2">
            Part photo gallery (JPEG only)
            <input
              name="partPhotos"
              type="file"
              multiple
              accept=".jpg,.jpeg,image/jpeg"
              onChange={(event) => {
                const files = Array.from(event.target.files || [])
                  .filter((file) => file.type === "image/jpeg")
                  .slice(0, 8);
                if (!files.length) {
                  setPartPhoto("");
                  setPartPhotos([]);
                  return;
                }
                Promise.all(
                  files.map(
                    (file) =>
                      new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.onload = () =>
                          resolve(
                            typeof reader.result === "string"
                              ? reader.result
                              : "",
                          );
                        reader.readAsDataURL(file);
                      }),
                  ),
                ).then((photos) => {
                  const validPhotos = photos.filter(Boolean);
                  setPartPhotos(validPhotos);
                  setPartPhoto(validPhotos[0] || "");
                });
              }}
              className="field mt-2 font-normal"
            />
            <span className="mt-1 block text-xs font-normal text-slate-500">
              Choose up to eight JPEG images. The gallery appears below and up
              to four photos print on the inventory card.
            </span>
          </label>
          {partPhotos.length > 0 && (
            <div className="inventory-gallery-preview sm:col-span-2">
              {partPhotos.map((photo, index) => (
                <figure key={index}>
                  <img src={photo} alt={`Part gallery preview ${index + 1}`} />
                  <figcaption>Photo {index + 1}</figcaption>
                </figure>
              ))}
            </div>
          )}
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 sm:col-span-2">
            <p className="font-black text-[#0d5796]">
              AI compatible-items search
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Uses the part name, SKU, interchange number, VIN and decoded
              vehicle information to browse for likely compatible items.
            </p>
            <a
              href={compatibleItemsAiUrl}
              target="_blank"
              rel="noreferrer"
              className="action primary mt-3"
            >
              <Link2 className="h-4 w-4" /> Search Compatible Items with AI
            </a>
            <p className="mt-2 text-xs font-semibold text-amber-800">
              Verify OEM numbers, connectors, dimensions, options and production
              dates before sale or installation.
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="action secondary">
            Cancel
          </button>
          <button className="action primary">
            <Plus className="h-5 w-5" /> Save under {donorStock}
          </button>
          <button
            type="button"
            onClick={() => printPaintRecord("inventory-card")}
            className="action primary"
          >
            <Printer className="h-5 w-5" /> Print Inventory Card
          </button>
        </div>
      </form>
    </div>
  );
}
