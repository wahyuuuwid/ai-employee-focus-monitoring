import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
};

const PADDING: Record<string, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function Card({
  children,
  className = "",
  padding = "md",
  hover = false,
}: Props) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_0_rgb(15_23_42_/_0.04),0_1px_6px_-2px_rgb(15_23_42_/_0.06)] ${
        hover
          ? "transition-all duration-200 hover:shadow-[0_4px_10px_-2px_rgb(15_23_42_/_0.06),0_12px_24px_-8px_rgb(15_23_42_/_0.10)] hover:border-slate-300"
          : ""
      } ${PADDING[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
