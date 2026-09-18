import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parts Inventory",
  robots: { index: false, follow: false },
};

export default function PartsInventoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
