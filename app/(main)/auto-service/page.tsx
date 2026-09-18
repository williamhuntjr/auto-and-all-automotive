import { ServicePage } from "@/components/service-page";
import { pageMetadata } from "@/common/lib/seo";
export const metadata = pageMetadata("auto-service");
export const dynamic = "force-dynamic";
export default function Page() {
  return (
    <ServicePage
      image="/service-writer-header.png"
      categorySlug="auto-service"
      kicker="Auto service & repair"
      title="Find the cause. Fix what matters."
      intro="Straightforward diagnostics, maintenance and repair decisions organized by safety, reliability and your priorities."
      items={[
        {
          title: "Diagnostics",
          text: "Symptom-based inspection and testing to identify the cause before replacing parts.",
        },
        {
          title: "Maintenance",
          text: "Oil service, fluids, filters and scheduled care to keep your vehicle dependable.",
        },
        {
          title: "Mechanical repairs",
          text: "Brake, steering, suspension, cooling and common engine-related repairs.",
        },
      ]}
      cta={{
        kicker: "START WITH THE SYMPTOMS",
        title: "Not sure what’s wrong? Let’s find the cause.",
        text: "Describe what you’re noticing and we’ll help you decide where to look first. Diagnostics come before parts, so repairs are based on what’s actually wrong, and you approve the work before it begins.",
        buttonLabel: "Describe the problem",
      }}
    />
  );
}
