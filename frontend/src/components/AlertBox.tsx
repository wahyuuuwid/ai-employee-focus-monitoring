import { AlertTriangle, OctagonAlert } from "lucide-react";

type Props = {
  status: string;
  duration: number;
};

export default function AlertBox({ status, duration }: Props) {
  // =========================
  // HIDE ALERT
  // =========================
  if (status !== "NOT FOCUS") {
    return null;
  }

  // =========================
  // ALERT LEVEL
  // =========================
  const isCritical = duration >= 10;

  return (
    <div
      className={`ws-fade-in flex items-start gap-3 rounded-2xl border p-5 ${
        isCritical
          ? "border-[#FECACA] bg-[#FEF2F2]"
          : "border-[#FDE68A] bg-[#FFFBEB]"
      }`}
    >
      <div
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          isCritical
            ? "bg-[#FEE2E2] text-[#EF4444]"
            : "bg-[#FEF3C7] text-[#F59E0B]"
        }`}
      >
        {isCritical ? <OctagonAlert size={18} /> : <AlertTriangle size={18} />}
      </div>

      <div>
        <h2
          className={`text-base font-bold ${
            isCritical ? "text-[#EF4444]" : "text-[#B45309]"
          }`}
        >
          {isCritical ? "Critical Alert" : "Warning"}
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          {isCritical
            ? `Pengguna kehilangan fokus selama ${duration} detik.`
            : "Pengguna mulai kehilangan fokus."}
        </p>
        <a
          href="/history"
          className="mt-2 inline-block text-xs font-semibold underline"
          style={{ color: isCritical ? "#EF4444" : "#B45309" }}
        >
          Lihat Detail
        </a>
      </div>
    </div>
  );
}
