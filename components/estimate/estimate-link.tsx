"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ESTIMATE_HREF } from "@/common/lib/links";

/**
 * A link to the estimate form on the contact page. From other pages it
 * navigates there and scrolls to the form. When you're already on the contact
 * page it scrolls straight to the form instead, because a repeat click on the
 * same #hash otherwise does nothing.
 */
export function EstimateLink({
  onClick,
  ...props
}: Omit<ComponentProps<typeof Link>, "href">) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      href={ESTIMATE_HREF}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || pathname !== "/contact") return;
        const form = document.getElementById("estimate-form");
        if (!form) return;
        event.preventDefault();
        form.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", ESTIMATE_HREF);
      }}
    />
  );
}
