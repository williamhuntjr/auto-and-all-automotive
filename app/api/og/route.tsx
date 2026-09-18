import { ImageResponse } from "next/og";
import { PAGES, SITE, type PageKey } from "@/common/lib/seo";

const INK = "#101216";
const PAPER = "#f2f0eb";
const BLUE = "#2367d8";
const RED = "#e24a39";
const CORAL = "#ff746b";

async function loadLogo(origin: string) {
  try {
    const response = await fetch(`${origin}/auto-and-all-logo-clean.png`);
    if (!response.ok) return null;
    const bytes = Buffer.from(await response.arrayBuffer());
    return `data:image/png;base64,${bytes.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requested = url.searchParams.get("page") as PageKey | null;
  const page = requested && requested in PAGES ? PAGES[requested] : PAGES.home;
  const logo = await loadLogo(url.origin);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: INK,
          backgroundImage: `radial-gradient(circle at 92% 0%, rgba(35,103,216,0.55), rgba(16,18,22,0) 55%), radial-gradient(circle at 0% 100%, rgba(226,74,57,0.28), rgba(16,18,22,0) 50%)`,
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            height: 14,
            backgroundImage: `linear-gradient(90deg, ${RED}, ${BLUE})`,
          }}
        />
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 72px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 640,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 26,
                letterSpacing: 6,
                textTransform: "uppercase",
                color: CORAL,
              }}
            >
              {page.ogKicker}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 26,
                fontSize: 72,
                lineHeight: 1.05,
                letterSpacing: -2,
                color: "white",
              }}
            >
              {page.ogTitle}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 400,
              height: 250,
              background: PAPER,
              borderBottom: `10px solid ${RED}`,
              boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
            }}
          >
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} width={340} height={170} alt="" />
            ) : (
              <div
                style={{
                  display: "flex",
                  width: 320,
                  justifyContent: "center",
                  textAlign: "center",
                  fontSize: 44,
                  lineHeight: 1.1,
                  color: INK,
                  letterSpacing: -1,
                }}
              >
                AUTO AND ALL AUTOMOTIVE
              </div>
            )}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "26px 72px",
            borderTop: "1px solid rgba(255,255,255,0.14)",
            fontSize: 24,
            letterSpacing: 2,
            color: "#aab1bd",
          }}
        >
          <div style={{ display: "flex" }}>
            {`${SITE.address.street} · ${SITE.address.city}, ${SITE.address.state}`}
          </div>
          <div style={{ display: "flex", color: "white" }}>
            {new URL(SITE.url).host}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
