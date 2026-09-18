import type { Part } from "./types";

export function PrintList({
  parts,
  filtered,
  selected,
  active,
}: {
  parts: Part[];
  filtered: Part[];
  selected: number[];
  active: boolean;
}) {
  return (
    <section className={`print-document ${active ? "print-active" : ""}`}>
      <div className="print-heading">
        <strong>AUTO AND ALL AUTOMOTIVE</strong>
        <span>Parts Inventory Print List</span>
      </div>
      <table className="print-table">
        <thead>
          <tr>
            <th>Part</th>
            <th>SKU</th>
            <th>Donor</th>
            <th>Vehicle</th>
            <th>Shelf</th>
            <th>Qty.</th>
          </tr>
        </thead>
        <tbody>
          {(selected.length
            ? parts.filter((part) => selected.includes(part.id))
            : filtered
          ).map((part) => (
            <tr key={part.id}>
              <td>{part.name}</td>
              <td>{part.sku}</td>
              <td>{part.donorStock}</td>
              <td>
                {part.year} {part.make} {part.model}
              </td>
              <td>{part.shelf}</td>
              <td>{part.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
