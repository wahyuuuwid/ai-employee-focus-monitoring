import type { ReactNode } from "react";

type Props = {
  title: string;
  value: string;
  icon?: ReactNode;
  accent?: string;
};

export default function StatsCard({ title, value, icon, accent = "#2563EB" }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_0_rgb(15_23_42_/_0.04),0_1px_6px_-2px_rgb(15_23_42_/_0.06)] transition-shadow hover:shadow-[0_4px_10px_-2px_rgb(15_23_42_/_0.06),0_12px_24px_-8px_rgb(15_23_42_/_0.10)]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        {icon && (
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${accent}14`, color: accent }}
          >
            {icon}
          </div>
        )}
      </div>

      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{value}</h1>
    </div>
  );
}
