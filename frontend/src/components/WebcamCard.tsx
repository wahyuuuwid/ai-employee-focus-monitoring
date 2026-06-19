import { Camera } from "lucide-react";

type Props = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  status: string;
};

export default function WebcamCard({ videoRef, canvasRef, status }: Props) {
  const isFocus = status === "FOCUS";
  const isNotFocus = status === "NOT FOCUS";

  const dotColor = isFocus
    ? "bg-[#10B981]"
    : isNotFocus
    ? "bg-[#EF4444]"
    : "bg-[#F59E0B]";

  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_0_rgb(15_23_42_/_0.04),0_1px_6px_-2px_rgb(15_23_42_/_0.06)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera size={16} className="text-slate-400" />
          <p className="text-sm font-semibold text-slate-700">Live Camera Feed</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
          <span className="ws-live-dot h-1.5 w-1.5 rounded-full bg-[#10B981]" />
          LIVE
        </span>
      </div>

      <div className="relative w-full h-[500px] overflow-hidden rounded-xl bg-slate-900">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
        />
      </div>

      <canvas ref={canvasRef} width={160} height={160} className="hidden" />

      <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
        <div className={`h-2.5 w-2.5 rounded-full ${dotColor}`} />
        <p className="text-sm font-medium text-slate-600">{status}</p>
      </div>
    </div>
  );
}
