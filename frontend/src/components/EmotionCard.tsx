import { Eye, EyeOff, Loader2, ScanFace } from "lucide-react";

type Props = {
  emotion: string;
  color: string;
};

const ICONS: Record<string, typeof Eye> = {
  Fokus: Eye,
  "Tidak Fokus": EyeOff,
  Mendeteksi: ScanFace,
  Loading: Loader2,
};

export default function EmotionCard({ emotion, color }: Props) {
  const Icon = ICONS[emotion] || ScanFace;
  const isLoading = emotion === "Loading";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_0_rgb(15_23_42_/_0.04),0_1px_6px_-2px_rgb(15_23_42_/_0.06)]">
      <p className="mb-3 text-sm font-medium text-slate-500">Kondisi Pengguna</p>

      <div className="flex items-center gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${color}1A` }}
        >
          <Icon size={20} style={{ color }} className={isLoading ? "animate-spin" : ""} />
        </div>
        <h1 className="text-2xl font-bold leading-tight" style={{ color }}>
          {emotion}
        </h1>
      </div>
    </div>
  );
}
