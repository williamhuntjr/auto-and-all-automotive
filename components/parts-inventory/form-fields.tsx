export function FieldValue({
  name,
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="font-bold text-slate-700">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        step={type === "number" ? ".01" : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="field mt-2 font-normal"
      />
    </label>
  );
}

export function EditableChoice({
  name,
  label,
  value,
  onChange,
  options,
  required = false,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
}) {
  const listId = `${name}-suggestions`;
  return (
    <label className="font-bold text-slate-700">
      {label}
      <input
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        list={listId}
        required={required}
        className="field mt-2 font-normal"
        autoComplete="off"
      />
      <datalist id={listId}>
        {options.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
      <span className="mt-1 block text-xs font-normal text-slate-500">
        VIN-filled and manually editable
      </span>
    </label>
  );
}
