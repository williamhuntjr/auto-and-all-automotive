import Link from "next/link";
import { EstimateLink } from "@/components/estimate/estimate-link";

export function Hero() {
  return (
    <section className="hero">
      <div className="heroCopy">
        <p className="eyebrow">One shop. Three disciplines.</p>
        <h1>
          Repair the damage.
          <br />
          <em>Reimagine the finish.</em>
        </h1>
        <p className="lede">
          Collision repair, custom refinishing and mechanical
          service—organized around honest communication and workmanship you
          can see.
        </p>
        <div className="actions">
          <EstimateLink className="primary">
            Request an estimate <span>↗</span>
          </EstimateLink>
          <Link className="secondary" href="/work">
            Explore our work
          </Link>
        </div>
        <div className="trust">
          <span>Clear repair plans</span>
          <span>Photo updates</span>
          <span>Quality-focused finish</span>
        </div>
      </div>
      <div className="heroVisual">
        <div className="imageFrame" />
        <p className="vertical">COLLISION / COLOR / CARE</p>
      </div>
    </section>
  );
}
