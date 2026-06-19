type Props = {
  status: string;
};

export default function StatusCard({ status }: Props) {
  const isFocus = status === "Focus";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_0_rgb(15_23_42_/_0.04),0_1px_6px_-2px_rgb(15_23_42_/_0.06)]">
      <p className="mb-2 text-sm font-medium text-slate-500">Status Saat Ini</p>
      <h1
        className={`text-3xl font-bold ${isFocus ? "text-[#10B981]" : "text-[#EF4444]"}`}
      >
        {status}
      </h1>
    </div>
  );
}
