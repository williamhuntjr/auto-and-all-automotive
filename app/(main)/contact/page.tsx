import { EstimateLink } from "@/components/estimate/estimate-link";
import { EstimateForm } from "@/components/estimate/estimate-form";
import { pageMetadata } from "@/common/lib/seo";

export const metadata = pageMetadata("contact");
export default function Page() {
  return (
    <main>
      <section className="contactHero">
        <img
          src="/shop-exterior.png"
          alt="Auto And All Automotive shop exterior at 1050 US Highway 158 East in Sunbury, North Carolina"
        />
        <div className="contactOverlay">
          <p className="eyebrow">Visit Auto And All Automotive</p>
          <h1>Your local shop in Sunbury.</h1>
          <p>
            Collision repair, custom paint, diagnostics, maintenance and
            mechanical service from one convenient location.
          </p>
        </div>
      </section>
      <section className="content contactContent">
        <div className="contentGrid">
          <article className="contentCard">
            <span>EMAIL</span>
            <h2>Contact us</h2>
            <p>
              <a href="mailto:contact@autoandallautomotive.com">contact@autoandallautomotive.com</a>
            </p>
          </article>
          <article className="contentCard">
            <span>VISIT</span>
            <h2>Shop address</h2>
            <p>
              1050 US Highway 158 E
              <br />
              Sunbury, NC 27979
            </p>
            <a
              className="mapLink"
              href="https://maps.app.goo.gl/dn8C8tZeh2MhSafU6"
              target="_blank"
              rel="noreferrer"
            >
              Get directions ↗
            </a>
          </article>
          <article className="contentCard">
            <span>HOURS</span>
            <h2>Business hours</h2>
            <p>
              <strong>Monday–Friday:</strong> 9:00 AM–6:00 PM
              <br />
              <strong>Saturday:</strong> 9:00 AM–5:00 PM
              <br />
              <strong>Sunday:</strong> Closed
            </p>
            <small>
              Holiday and federal-holiday hours will be posted on the website.
            </small>
          </article>
        </div>
        <div className="contactCta">
          <span>BEFORE YOU DRIVE OVER</span>
          <h2>Send photos first. We’ll come back with a plan.</h2>
          <p>
            Share your vehicle details and photos of the damage, and the shop
            will prepare a preliminary estimate before you make the trip. We
            serve the Outer Banks and the Hampton Roads area, and towing
            service is available too.
          </p>
          <div className="contactCtaActions">
            <EstimateLink className="primary light">
              Start a photo estimate <span>↗</span>
            </EstimateLink>
            <a
              className="secondary"
              href="https://maps.app.goo.gl/dn8C8tZeh2MhSafU6"
              target="_blank"
              rel="noreferrer"
            >
              Get directions ↗
            </a>
          </div>
        </div>
        <div className="contactForm" id="estimate-form">
          <p className="sectionLabel">Request an estimate</p>
          <EstimateForm />
        </div>
      </section>
    </main>
  );
}
