export function CategoryHero({
  kicker,
  title,
  intro,
  image,
}: {
  kicker: string;
  title: string;
  intro: string;
  image: string;
}) {
  return (
    <section className="categoryHero">
      <img
        className="categoryHeroImage"
        src={image}
        alt={kicker + " abstract automotive service scene"}
      />
      <div className="categoryHeroShade" />
      <div className="categoryHeroCopy">
        <p className="eyebrow">{kicker}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>
      <span className="heroTag">AUTO AND ALL AUTOMOTIVE / PROCESS / RESULTS</span>
    </section>
  );
}
