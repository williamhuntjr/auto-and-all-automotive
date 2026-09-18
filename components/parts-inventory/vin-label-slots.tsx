export function VinLabelSlots({ vin }: { vin: string }) {
  const characters = vin.toUpperCase().padEnd(17, " ").slice(0, 17).split("");
  const renderCharacters = (items: string[], startIndex: number) =>
    items.map((character, index) => {
      const actualIndex = startIndex + index;
      return (
        <span
          key={actualIndex}
          className={actualIndex === 9 ? "vin-year-character" : ""}
        >
          <b>{character || "\u00a0"}</b>
          <i aria-hidden="true">—</i>
        </span>
      );
    });
  return (
    <div className="vin-label" aria-label={`Full VIN ${vin || "not entered"}`}>
      <div className="vin-label-line vin-first-line">
        {renderCharacters(characters.slice(0, 10), 0)}
      </div>
      <div className="vin-label-line vin-second-line">
        {renderCharacters(characters.slice(10), 10)}
      </div>
    </div>
  );
}
