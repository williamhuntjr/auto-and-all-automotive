export async function GET(request: Request) {
  const url = new URL(request.url);
  const vin = (url.searchParams.get("vin") || "")
    .toUpperCase()
    .replace(/[^A-HJ-NPR-Z0-9]/g, "")
    .slice(0, 17);

  if (vin.length !== 17) {
    return Response.json(
      { error: "A complete 17-character VIN is required." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${encodeURIComponent(vin)}?format=json`,
      { headers: { Accept: "application/json" } },
    );
    if (!response.ok) throw new Error("VIN provider unavailable");
    const data = await response.json();
    return Response.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json(
      { error: "The VIN service is temporarily unavailable." },
      { status: 502 },
    );
  }
}
