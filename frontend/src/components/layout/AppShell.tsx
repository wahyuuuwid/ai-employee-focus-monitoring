import { useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

type Props = {
  title: string;
  subtitle?: string;
  variant: "employee" | "admin";
  children: ReactNode;
};

export default function AppShell({ title, subtitle, variant, children }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        variant={variant}
      />

      <Topbar title={title} subtitle={subtitle} sidebarCollapsed={collapsed} />

      <main
        className={`pt-16 transition-all duration-200 ${
          collapsed ? "pl-[76px]" : "pl-[248px]"
        }`}
      >
        <div className="ws-fade-in mx-auto max-w-[1400px] px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
