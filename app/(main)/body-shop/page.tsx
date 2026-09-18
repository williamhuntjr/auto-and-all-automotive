import { ServicePage } from "@/components/service-page";
import { pageMetadata } from "@/common/lib/seo";
export const metadata = pageMetadata("body-shop");
export const dynamic = "force-dynamic";
export default function Page() {
  return (
    <ServicePage
      image="/collision-photo-header.png"
      categorySlug="body-shop"
      kicker="Collision & body repair"
      title="Restore the structure. Refine every surface."
      intro="A methodical path from visible damage to a safe, straight and properly finished vehicle—with clear updates throughout the repair."
      items={[
        {
          title: "Collision repair",
          text: "Repair planning for dents, panel damage and collision-related structural concerns.",
        },
        {
          title: "Panel & dent work",
          text: "Metal and panel correction focused on fit, contour and clean transitions.",
        },
        {
          title: "Paint matching",
          text: "Careful color evaluation, refinishing and blending where the repair requires it.",
        },
      ]}
      cta={{
        kicker: "START YOUR REPAIR PLAN",
        title: "Damaged vehicle? Start with a few photos.",
        text: "Send photos and a short description of the damage, and the shop will review the repair, explain what it will take and outline the next steps. Nothing moves forward until the scope is clear.",
        buttonLabel: "Send damage photos",
      }}
    />
  );
}
