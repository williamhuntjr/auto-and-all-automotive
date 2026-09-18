"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const navLinks = [
  { href: "/body-shop", label: "Body Shop" },
  { href: "/custom-paint", label: "Custom Paint" },
  { href: "/auto-service", label: "Auto Service" },
  { href: "/work", label: "Work" },
];

export function Navbar() {
  const pathname = usePathname();
  return (
    <nav>
      {navLinks.map((link) => {
        const active =
          pathname === link.href || pathname.startsWith(link.href + "/");
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
