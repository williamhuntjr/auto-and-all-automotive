import { CategoryHero } from "@/components/category-hero";
import { pageMetadata } from "@/common/lib/seo";

const projects = [
  { title: "Collision restoration", description: "Structural and cosmetic repairs brought back into alignment with a clean, consistent finish.", image: "/collision-photo-header.png" },
  { title: "Custom color", description: "Specialty refinishing with careful color development, application and final detailing.", image: "/hero-auto-shop.png" },
  { title: "Panel refinishing", description: "Panel preparation, color matching and blending designed to restore a unified appearance.", image: "/estimator-header.png" },
  { title: "Mechanical care", description: "Practical diagnostics, service and repair work performed alongside the body-shop process.", image: "/service-writer-header.png" },
];

export const metadata = pageMetadata("work");
export default function Page() {
  return (
    <main>
      <CategoryHero image="/collision-photo-header.png" kicker="Selected work" title="Quality lives in the details." intro="Collision repair, refinishing and mechanical work presented through representative project imagery." />
      <section className="content workSection">
        <div className="workIntro">
          <p className="sectionLabel">Project capabilities</p>
          <p>Every project begins with a different problem. Our process stays focused on accurate preparation, clear repair planning and a finish appropriate for the vehicle.</p>
        </div>
        <div className="galleryGrid">
          {projects.map((project, index) => (
            <article className="galleryItem" key={project.title} style={{ backgroundImage: `linear-gradient(180deg, rgba(8,18,32,.08) 15%, rgba(8,18,32,.9) 100%), url('${project.image}')` }}>
              <div className="galleryProjectCopy">
                <small>PROJECT 0{index + 1}</small>
                <h2>{project.title}</h2>
                <p>{project.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
