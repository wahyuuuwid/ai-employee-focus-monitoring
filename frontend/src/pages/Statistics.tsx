import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AppShell from "../components/layout/AppShell";
import API from "../services/api";
import { Database, Eye, EyeOff, BarChart3 } from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type StatisticsType = {
  total_data: number;
  focus_percentage: number;
  not_focus_percentage: number;
  average_focus_score: number;
};

export default function Statistics() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatisticsType | null>(null);

  // Check if token exists, if not redirect to login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // =========================
  // FETCH DATA
  // =========================

  const fetchStatistics = async () => {
    try {
      const response = await API.get("/statistics");

      setStats(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // AUTO REFRESH
  // =========================

  useEffect(() => {
    fetchStatistics();

    const interval = setInterval(() => {
      fetchStatistics();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // =========================
  // CHART DATA
  // =========================

  const chartData = [
    {
      name: "Focus",
      focus: stats?.focus_percentage || 0,
    },
    {
      name: "Not Focus",
      notFocus: stats?.not_focus_percentage || 0,
    },
    {
      name: "Average",
      average: stats?.average_focus_score || 0,
    },
  ];

  return (
    <AppShell
      title="Statistik Monitoring"
      subtitle="Aggregate focus performance overview"
      variant="employee"
    >
      {/* SUMMARY */}
      <div className="grid md:grid-cols-3 gap-5 mb-6">
        {/* TOTAL */}
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_1px_2px_0_rgb(15_23_42_/_0.04),0_1px_6px_-2px_rgb(15_23_42_/_0.06)]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-500">Total Data</h2>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
              <Database size={16} />
            </div>
          </div>
          <p className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            {stats?.total_data || 0}
          </p>
        </div>

        {/* FOCUS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_1px_2px_0_rgb(15_23_42_/_0.04),0_1px_6px_-2px_rgb(15_23_42_/_0.06)]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-500">Focus</h2>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#10B981]/10 text-[#10B981]">
              <Eye size={16} />
            </div>
          </div>
          <p className="mt-3 text-4xl font-bold tracking-tight text-[#10B981]">
            {stats?.focus_percentage || 0}%
          </p>
        </div>

        {/* NOT FOCUS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_1px_2px_0_rgb(15_23_42_/_0.04),0_1px_6px_-2px_rgb(15_23_42_/_0.06)]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-500">Not Focus</h2>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EF4444]/10 text-[#EF4444]">
              <EyeOff size={16} />
            </div>
          </div>
          <p className="mt-3 text-4xl font-bold tracking-tight text-[#EF4444]">
            {stats?.not_focus_percentage || 0}%
          </p>
        </div>
      </div>

      {/* CHART */}
      <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_1px_2px_0_rgb(15_23_42_/_0.04),0_1px_6px_-2px_rgb(15_23_42_/_0.06)]">
        <div className="mb-6 flex items-center gap-2.5">
          <BarChart3 size={18} className="text-slate-400" />
          <h2 className="text-lg font-bold text-slate-900">Grafik Monitoring</h2>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />

              <XAxis
                dataKey="name"
                tick={{ fill: "#64748B", fontSize: 12, fontFamily: "Inter" }}
                axisLine={{ stroke: "#E2E8F0" }}
                tickLine={false}
              />

              <YAxis
                tick={{ fill: "#64748B", fontSize: 12, fontFamily: "Inter" }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 4px 10px -2px rgb(15 23 42 / 0.06)",
                  fontFamily: "Inter",
                  fontSize: 13,
                }}
              />

              <Bar dataKey="focus" fill="#10B981" radius={[8, 8, 0, 0]} maxBarSize={64} />

              <Bar
                dataKey="notFocus"
                fill="#EF4444"
                radius={[8, 8, 0, 0]}
                maxBarSize={64}
              />

              <Bar dataKey="average" fill="#2563EB" radius={[8, 8, 0, 0]} maxBarSize={64} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppShell>
  );
}
