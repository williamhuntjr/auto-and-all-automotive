"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/components/layout/navbar";
import { EstimateLink } from "@/components/estimate/estimate-link";

const links = [{ href: "/", label: "Home" }, ...navLinks];

export function NavbarMobile() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const desktop = window.matchMedia("(min-width: 851px)");
    const onResize = () => desktop.matches && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="navToggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>
      <div className={`navBackdrop${open ? " open" : ""}`} onClick={close} />
      <aside
        id="mobile-menu"
        className={`navDrawer${open ? " open" : ""}`}
        aria-hidden={!open}
      >
        <Link href="/" onClick={close}>
          <img className="drawerLogo" src="/auto-and-all-logo-clean.png" alt="Auto And All Automotive" />
        </Link>
        <p className="drawerLabel">Menu</p>
        <nav aria-label="Main navigation">
          <ul className="drawerLinks">
            {links.map((link, i) => (
              <li key={link.href} style={{ "--i": i } as React.CSSProperties}>
                <Link
                  href={link.href}
                  onClick={close}
                  aria-current={pathname === link.href ? "page" : undefined}
                >
                  <span>0{i + 1}</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <EstimateLink className="primary drawerCta" onClick={close}>
          Start an estimate <span>↗</span>
        </EstimateLink>
        <div className="drawerInfo">
          <strong>Visit the shop</strong>
          1050 US Highway 158 E<br />
          Sunbury, NC 27979
          <br />
          <a href="mailto:contact@autoandallautomotive.com">contact@autoandallautomotive.com</a>
          <br />
          Mon–Fri 9–6 · Sat 9–5 · Sun closed
          <br />
          <Link href="/contact" onClick={close}>Contact &amp; directions ↗</Link>
        </div>
      </aside>
    </>
  );
}
