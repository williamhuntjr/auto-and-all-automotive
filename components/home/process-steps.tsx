const steps = [
  {
    title: "Tell us what you need",
    text: "Share photos, symptoms or the finish you have in mind.",
  },
  {
    title: "Review the plan",
    text: "We explain the work, priorities and expected timeline.",
  },
  {
    title: "Approve with confidence",
    text: "Nothing moves forward until the scope is clear.",
  },
];

export function ProcessSteps() {
  return (
    <section className="process">
      <div>
        <p className="eyebrow">A calmer repair experience</p>
        <h2>Know what happens next.</h2>
      </div>
      <ol>
        {steps.map((step, index) => (
          <li key={step.title}>
            <b>{String(index + 1).padStart(2, "0")}</b>
            <span>
              <strong>{step.title}</strong>
              {step.text}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
