import type { CategoryRecord } from "@/common/db/categories";
import { ESTIMATE_HREF } from "@/common/lib/links";

export type HomeService = {
  n: string;
  title: string;
  label: string;
  text: string;
  href: string;
  image: string;
};

/** Shown until categories have been added from the admin dashboard. */
export const defaultHomeServices: HomeService[] = [
  {
    n: "01",
    title: "Collision & Body",
    label: "Damage to detail",
    text: "Structural and cosmetic repairs planned around safety, fit and a clean factory-style finish.",
    href: "/body-shop",
    image: "/collision-photo-header.png",
  },
  {
    n: "02",
    title: "Online Photo Estimate",
    label: "Photos to repair plan",
    text: "An estimator reviews vehicle photos and damage details to prepare the first repair conversation.",
    href: ESTIMATE_HREF,
    image: "/estimator-header.png",
  },
  {
    n: "03",
    title: "Service & Diagnostics",
    label: "Test before replacing",
    text: "Diagnostics, maintenance, brakes, suspension and everyday repairs with a clear approval process.",
    href: "/auto-service",
    image: "/service-writer-header.png",
  },
];

/** Top-level categories from the database, or the defaults when there are none. */
export function toHomeServices(categories: CategoryRecord[]): HomeService[] {
  const services = categories
    .filter((category) => !category.parent_id)
    .map((category, index) => ({
      n: String(index + 1).padStart(2, "0"),
      title: category.name,
      label: "Professional service category",
      text: category.description,
      href: "/" + category.slug,
      image: category.image || "/hero-auto-shop.png",
    }));
  return services.length ? services : defaultHomeServices;
}
