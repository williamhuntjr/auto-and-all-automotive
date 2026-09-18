import { ServicePage } from "@/components/service-page";
import { pageMetadata } from "@/common/lib/seo";
export const metadata = pageMetadata("custom-paint");
export const dynamic = "force-dynamic";
export default function Page() {
  return (
    <ServicePage
      image="/collision-photo-header.png"
      categorySlug="custom-paint"
      kicker="Custom paint & refinishing"
      title="A finish made to be remembered."
      intro="From restrained color changes to bold specialty finishes, each project starts with the idea and succeeds through preparation."
      items={[
        {
          title: "Full color changes",
          text: "A complete refinishing plan designed around coverage, jambs, trim and a cohesive final appearance.",
        },
        {
          title: "Graphics & accents",
          text: "Stripes, panels and visual accents composed to complement the vehicle’s lines.",
        },
        {
          title: "Specialty finishes",
          text: "Pearl, metallic and layered effects planned with test panels and controlled application.",
        },
      ]}
      cta={{
        kicker: "START YOUR PROJECT",
        title: "Have a color or finish in mind?",
        text: "Tell us about the vehicle and the look you’re after — a full color change, custom graphics or a specialty finish. We’ll talk through preparation, color development and what the project involves before you commit.",
        buttonLabel: "Start your paint project",
      }}
    />
  );
}
