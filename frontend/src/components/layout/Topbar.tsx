import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  sidebarCollapsed: boolean;
};

export default function Topbar({ title, subtitle, sidebarCollapsed }: Props) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const role = localStorage.getItem("role") || "user";

  return (
    <header
      className={`fixed top-0 right-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 backdrop-blur-sm px-8 transition-all duration-200 ${
        sidebarCollapsed ? "left-[76px]" : "left-[248px]"
      }`}
    >
      <div>
        <h1 className="text-[17px] font-bold text-slate-900 leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2563EB]/10 text-[#2563EB]">
            <User size={13} />
          </div>
          <span className="text-xs font-semibold capitalize text-slate-600">{role}</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-[10px] border border-slate-200 px-3.5 py-2 text-[13px] font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-[#EF4444]"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
