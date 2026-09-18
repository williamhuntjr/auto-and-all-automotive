"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { EstimateLink } from "@/components/estimate/estimate-link";

export function Header() {
  const isHome = usePathname() === "/";
  const headerRef = useRef<HTMLElement>(null);
  const [stuck, setStuck] = useState(false);

  // The nav is `position: sticky`; it counts as stuck once it has reached the
  // top of the viewport after the page has been scrolled.
  useEffect(() => {
    const update = () => {
      const top = headerRef.current?.getBoundingClientRect().top ?? 1;
      setStuck(window.scrollY > 0 && top <= 0.5);
    };
    const frame = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [isHome]);

  const className = ["nav", isHome && "navLogoFade", stuck && "navStuck"]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {isHome && (
        <section className="homeMasthead" aria-label="Auto And All Automotive">
          <img src="/auto-and-all-logo-clean.png" alt="Auto And All Automotive"/>
          <div className="mastheadLine"><span>Collision Center</span><i/><span>Custom Paint</span><i/><span>Auto Service & Repair</span></div>
          <p>1050 US Highway 158 E · Sunbury, North Carolina</p>
        </section>
      )}
      <header ref={headerRef} className={className}>
        <Link className="brand" href="/">
          <img className="siteLogo" src="/auto-and-all-logo-clean.png" alt="Auto And All Automotive"/>
        </Link>
        <Navbar />
        <EstimateLink className="navCta">
          Start an estimate
        </EstimateLink>
      </header>
      <p className="locationNotice">We are conveniently located within reasonable driving distance of North Carolina’s Outer Banks and the Hampton Roads area, including Chesapeake, Virginia Beach, Norfolk, Portsmouth, and Hampton. We offer reasonably priced towing service.</p>
    </>
  );
}
