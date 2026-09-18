import { EstimateLink } from "@/components/estimate/estimate-link";

type CtaBandProps = {
  kicker: string;
  title: string;
  /** Optional supporting paragraph under the headline. */
  text?: string;
  buttonLabel: string;
};

/** Full-width blue call-to-action band, shared by the homepage and service pages. */
export function CtaBand({
  kicker,
  title,
  text,
  buttonLabel,
}: CtaBandProps) {
  return (
    <section className="closing">
      <p>{kicker}</p>
      <h2 className={text ? "hasText" : undefined}>{title}</h2>
      {text && <p className="closingText">{text}</p>}
      <EstimateLink className="primary light">
        {buttonLabel} <span>↗</span>
      </EstimateLink>
    </section>
  );
}
