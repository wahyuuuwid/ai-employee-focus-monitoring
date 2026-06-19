import { useState, useEffect } from "react";
import API from "../services/api";
import AppShell from "../components/layout/AppShell";
import { Users, Activity, Gauge, Eye, AlertCircle } from "lucide-react";

interface Analytics {
  total_users: number;
  total_sessions: number;
  average_focus_score: number;
  status_breakdown: Record<string, number>;
  top_users: Array<{
    user_id: number;
    name: string;
    avg_focus_score: number;
    session_count: number;
  }>;
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await API.get("/admin/analytics");
      setAnalytics(res.data);
    } catch (err) {
      setError("Failed to load analytics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppShell title="Admin Dashboard" subtitle="Employee Focus Management" variant="admin">
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#2563EB]" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Admin Dashboard" subtitle="Employee Focus Management" variant="admin">
      {error && (
        <div
          className="mb-6 flex items-center gap-2.5 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#EF4444]"
          role="alert"
        >
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-5 mb-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_0_rgb(15_23_42_/_0.04),0_1px_6px_-2px_rgb(15_23_42_/_0.06)]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Total Users</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
              <Users size={16} />
            </div>
          </div>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {analytics?.total_users || 0}
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_0_rgb(15_23_42_/_0.04),0_1px_6px_-2px_rgb(15_23_42_/_0.06)]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Total Sessions</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F59E0B]/10 text-[#F59E0B]">
              <Activity size={16} />
            </div>
          </div>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {analytics?.total_sessions || 0}
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_0_rgb(15_23_42_/_0.04),0_1px_6px_-2px_rgb(15_23_42_/_0.06)]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Avg Focus Score</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#10B981]/10 text-[#10B981]">
              <Gauge size={16} />
            </div>
          </div>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {analytics?.average_focus_score.toFixed(1) || 0}%
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_0_rgb(15_23_42_/_0.04),0_1px_6px_-2px_rgb(15_23_42_/_0.06)]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Focus Status</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1E293B]/10 text-[#1E293B]">
              <Eye size={16} />
            </div>
          </div>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {analytics?.status_breakdown?.FOCUS || 0}
          </h3>
        </div>
      </div>

      {/* Top Performing Users */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_0_rgb(15_23_42_/_0.04),0_1px_6px_-2px_rgb(15_23_42_/_0.06)]">
        <div className="border-b border-slate-100 px-7 py-5">
          <h2 className="text-lg font-bold text-slate-900">Top Performing Users</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="px-7 py-3.5 text-left font-semibold text-slate-500">
                  Name
                </th>
                <th className="px-7 py-3.5 text-left font-semibold text-slate-500">
                  Avg Focus Score
                </th>
                <th className="px-7 py-3.5 text-left font-semibold text-slate-500">
                  Sessions
                </th>
              </tr>
            </thead>
            <tbody>
              {analytics?.top_users.map((user) => (
                <tr
                  key={user.user_id}
                  className="border-b border-slate-100 transition-colors hover:bg-slate-50/60"
                >
                  <td className="px-7 py-4 font-medium text-slate-700">{user.name}</td>
                  <td className="px-7 py-4">
                    <span className="font-semibold text-[#10B981]">
                      {user.avg_focus_score.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-7 py-4 text-slate-600">{user.session_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
