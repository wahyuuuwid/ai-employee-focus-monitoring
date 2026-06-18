import type { ReactNode } from "react";

type Tone = "success" | "warning" | "danger" | "neutral" | "primary";

type Props = {
  tone?: Tone;
  children: ReactNode;
  dot?: boolean;
  className?: string;
};

const TONE_STYLES: Record<Tone, { bg: string; text: string; dot: string }> = {
  success: { bg: "bg-[#ECFDF5]", text: "text-[#10B981]", dot: "bg-[#10B981]" },
  warning: { bg: "bg-[#FFFBEB]", text: "text-[#B45309]", dot: "bg-[#F59E0B]" },
  danger: { bg: "bg-[#FEF2F2]", text: "text-[#EF4444]", dot: "bg-[#EF4444]" },
  neutral: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
  primary: { bg: "bg-[#EFF6FF]", text: "text-[#2563EB]", dot: "bg-[#2563EB]" },
};

export default function Badge({
  tone = "neutral",
  children,
  dot = false,
  className = "",
}: Props) {
  const styles = TONE_STYLES[tone];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${styles.bg} ${styles.text} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />}
      {children}
    </span>
  );
}
