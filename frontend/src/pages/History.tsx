import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AppShell from "../components/layout/AppShell";
import Badge from "../components/ui/Badge";
import API from "../services/api";
import { Clock, Inbox } from "lucide-react";

type HistoryType = {
  id: number;
  status: string;
  focus_score: number;
  created_at: string;
};

export default function History() {
  const navigate = useNavigate();

  const [history, setHistory] = useState<
    HistoryType[]
  >([]);

  // Check if token exists, if not redirect to login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const fetchHistory = async () => {

    try {

      const response =
        await API.get("/history");

      setHistory(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {

    fetchHistory();

    const interval = setInterval(() => {

      fetchHistory();

    }, 5000);

    return () => clearInterval(interval);

  }, []);

  return (
    <AppShell
      title="Riwayat Monitoring"
      subtitle="History of recorded focus monitoring sessions"
      variant="employee"
    >
      <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_0_rgb(15_23_42_/_0.04),0_1px_6px_-2px_rgb(15_23_42_/_0.06)]">

        <div className="flex items-center justify-between border-b border-slate-100 px-7 py-5">
          <div className="flex items-center gap-2.5">
            <Clock size={18} className="text-slate-400" />
            <h1 className="text-lg font-bold text-slate-900">
              Riwayat Monitoring
            </h1>
          </div>
          <span className="text-xs font-medium text-slate-400">
            Auto-refresh every 5s
          </span>
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Inbox size={22} />
            </div>
            <p className="text-sm text-slate-500">Belum ada data monitoring.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              <thead>

                <tr className="border-b border-slate-100 bg-slate-50/60">

                  <th className="px-7 py-3.5 text-left font-semibold text-slate-500">
                    Waktu
                  </th>

                  <th className="px-7 py-3.5 text-left font-semibold text-slate-500">
                    Kondisi
                  </th>

                  <th className="px-7 py-3.5 text-left font-semibold text-slate-500">
                    Persentase
                  </th>

                </tr>

              </thead>

              <tbody>

                {history.map((item) => (

                  <tr
                    key={item.id}
                    className="border-b border-slate-100 transition-colors hover:bg-slate-50/60"
                  >

                    <td className="px-7 py-4 text-slate-600">
                      {item.created_at}
                    </td>

                    <td className="px-7 py-4">

                      <Badge
                        tone={item.status === "FOCUS" ? "success" : "danger"}
                        dot
                      >
                        {item.status}
                      </Badge>

                    </td>

                    <td className="px-7 py-4 font-semibold text-slate-900">
                      {item.focus_score}%
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>
          </div>
        )}

      </div>
    </AppShell>
  );
}
