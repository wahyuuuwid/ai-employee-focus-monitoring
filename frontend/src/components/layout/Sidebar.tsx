import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  History,
  BarChart3,
  Users,
  ShieldCheck,
  ChevronsLeft,
  ChevronsRight,
  Activity,
} from "lucide-react";

type NavItem = {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
};

type Props = {
  collapsed: boolean;
  onToggle: () => void;
  variant: "employee" | "admin";
};

const EMPLOYEE_NAV: NavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Riwayat", to: "/history", icon: History },
  { label: "Statistik", to: "/statistics", icon: BarChart3 },
];

const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
];

export default function Sidebar({ collapsed, onToggle, variant }: Props) {
  const location = useLocation();
  const navItems = variant === "admin" ? ADMIN_NAV : EMPLOYEE_NAV;

  const isActive = (to: string) => {
    if (to === "/admin") return location.pathname === "/admin";
    return location.pathname === to;
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200 bg-[#1E293B] transition-all duration-200 ${
        collapsed ? "w-[76px]" : "w-[248px]"
      }`}
    >
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2563EB]">
          <Activity size={18} className="text-white" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="truncate text-[15px] font-bold text-white">WorkSight</p>
            <p className="truncate text-[11px] text-slate-400">
              {variant === "admin" ? "Admin Console" : ""}
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = isActive(item.to);
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  title={collapsed ? item.label : undefined}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                    active
                      ? "bg-[#2563EB] text-white"
                      : "text-slate-300 hover:bg-white/8 hover:text-white"
                  } ${collapsed ? "justify-center" : ""}`}
                >
                  <Icon size={18} strokeWidth={2} className="shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>

        
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-white/10 p-3">
        <button
          onClick={onToggle}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-slate-300 transition-colors hover:bg-white/8 hover:text-white ${
            collapsed ? "justify-center" : ""
          }`}
        >
          {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
