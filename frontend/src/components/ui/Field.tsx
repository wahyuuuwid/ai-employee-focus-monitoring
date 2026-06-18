import type { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";

type FieldWrapperProps = {
  label: string;
  hint?: string;
  children: ReactNode;
};

export function Field({ label, hint, children }: FieldWrapperProps) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
        {hint && (
          <span className="ml-1 text-xs font-normal text-slate-400">{hint}</span>
        )}
      </label>
      {children}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function TextInput({ className = "", ...rest }: InputProps) {
  return (
    <input
      className={`w-full rounded-[10px] border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 ${className}`}
      {...rest}
    />
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function SelectInput({ className = "", children, ...rest }: SelectProps) {
  return (
    <select
      className={`w-full rounded-[10px] border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 ${className}`}
      {...rest}
    >
      {children}
    </select>
  );
}
