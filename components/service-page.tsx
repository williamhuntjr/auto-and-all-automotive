import Link from "next/link";
import { listCategories } from "@/common/db/categories";
import { CategoryHero } from "@/components/category-hero";
import { CtaBand } from "@/components/cta-band";
import { EstimateLink } from "@/components/estimate/estimate-link";
export async function ServicePage({
  kicker,
  title,
  intro,
  image,
  categorySlug,
  items,
  cta,
}: {
  kicker: string;
  title: string;
  intro: string;
  image: string;
  categorySlug: string;
  items: { title: string; text: string }[];
  cta: { kicker: string; title: string; text: string; buttonLabel: string };
}) {
  const saved = await listCategories();
  const parent = saved.find((item) => item.slug === categorySlug);
  const savedItems = parent
    ? saved
        .filter((item) => item.parent_id === parent.id)
        .map((item) => ({ title: item.name, text: item.description }))
    : [];
  const displayedItems = savedItems.length ? savedItems : items;
  return (
    <main>
      <CategoryHero kicker={kicker} title={title} intro={intro} image={image} />
      <section className="content">
        <p className="sectionLabel">What we handle</p>
        <div className="contentGrid">
          {displayedItems.map((x, i) => (
            <article className="contentCard" key={x.title}>
              <span>0{i + 1}</span>
              <h2>{x.title}</h2>
              <p>{x.text}</p>
            </article>
          ))}
        </div>
        <div className="actions">
          <EstimateLink className="primary">
            Request an estimate <span>↗</span>
          </EstimateLink>
          <Link className="secondary" href="/contact">
            Talk to the shop
          </Link>
        </div>
      </section>
      <CtaBand {...cta} />
    </main>
  );
}
