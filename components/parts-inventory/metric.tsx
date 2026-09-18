import type { LucideIcon } from "lucide-react";

export function Metric({
  icon: Icon,
  label,
  value,
  note,
  color,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  note: string;
  color: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-bold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-tight">{value}</p>
          <p className="mt-2 text-sm text-slate-500">{note}</p>
        </div>
        <div className={`metric-icon ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </article>
  );
}
