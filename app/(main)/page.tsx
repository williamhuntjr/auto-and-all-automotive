import { listCategories } from "@/common/db/categories";
import { ClosingCta } from "@/components/home/closing-cta";
import { Hero } from "@/components/home/hero";
import { toHomeServices } from "@/components/home/home-services";
import { ProcessSteps } from "@/components/home/process-steps";
import { ServiceShowcase } from "@/components/home/service-showcase";
import { pageMetadata } from "@/common/lib/seo";

export const metadata = pageMetadata("home");
export const dynamic = "force-dynamic";

export default async function Home() {
  const services = toHomeServices(await listCategories());
  return (
    <main>
      <Hero />
      <ServiceShowcase services={services} />
      <ProcessSteps />
      <ClosingCta />
    </main>
  );
}
