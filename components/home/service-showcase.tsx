import Link from "next/link";
import type { HomeService } from "./home-services";

export function ServiceShowcase({ services }: { services: HomeService[] }) {
  return (
    <section className="serviceStrip">
      <p className="sectionLabel">Choose your service path</p>
      <div className="serviceShowcase">
        {services.map((service) => (
          <Link href={service.href} className="serviceFeature" key={service.n}>
            <div className="serviceMedia">
              <img src={service.image} alt={service.title + " abstract automotive scene"} />
              <span className="serviceNumber">{service.n}</span>
            </div>
            <div className="serviceFeatureCopy">
              <small>{service.label}</small>
              <h2>{service.title}</h2>
              <p>{service.text}</p>
              <b>Enter category <i>↗</i></b>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
