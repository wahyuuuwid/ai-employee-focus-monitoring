type Props = {
  value: number;
};

export default function ProgressFocus({ value }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_0_rgb(15_23_42_/_0.04),0_1px_6px_-2px_rgb(15_23_42_/_0.06)]">
      <div className="mb-3 flex justify-between">
        <p className="text-sm font-medium text-slate-500">Tingkat Fokus</p>
        <p className="text-sm font-bold text-slate-900">{value}%</p>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-3 rounded-full bg-[#2563EB] transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
