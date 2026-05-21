import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import API from "../services/api";

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
  const [stats, setStats] = useState<StatisticsType | null>(null);

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
    <div className="min-h-screen bg-[#F4FBFB]">
      <Navbar />

      <div className="max-w-7xl mx-auto p-10">
        {/* HEADER */}
        <h1
          className="text-3xl font-bold mb-8"
          style={{
            color: "#0B1320",
          }}
        >
          Statistik Monitoring
        </h1>

        {/* SUMMARY */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* TOTAL */}
          <div
            className="
              bg-white
              rounded-3xl
              border
              p-8
            "
            style={{
              borderColor: "#D7EEEE",
            }}
          >
            <h2 className="text-lg font-semibold">Total Data</h2>

            <p className="text-5xl font-bold mt-4">{stats?.total_data || 0}</p>
          </div>

          {/* FOCUS */}
          <div
            className="
              bg-white
              rounded-3xl
              border
              p-8
            "
            style={{
              borderColor: "#D7EEEE",
            }}
          >
            <h2 className="text-lg font-semibold">Focus</h2>

            <p className="text-5xl font-bold mt-4 text-green-500">
              {stats?.focus_percentage || 0}%
            </p>
          </div>

          {/* NOT FOCUS */}
          <div
            className="
              bg-white
              rounded-3xl
              border
              p-8
            "
            style={{
              borderColor: "#D7EEEE",
            }}
          >
            <h2 className="text-lg font-semibold">Not Focus</h2>

            <p className="text-5xl font-bold mt-4 text-red-500">
              {stats?.not_focus_percentage || 0}%
            </p>
          </div>
        </div>

        {/* CHART */}
        <div
          className="
            bg-white
            rounded-3xl
            border
            p-8
          "
          style={{
            borderColor: "#D7EEEE",
          }}
        >
          <h2 className="text-2xl font-bold mb-6">Grafik Monitoring</h2>

          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar dataKey="focus" fill="#22C55E" radius={[10, 10, 0, 0]} />

                <Bar
                  dataKey="notFocus"
                  fill="#EF4444"
                  radius={[10, 10, 0, 0]}
                />

                <Bar dataKey="average" fill="#3B82F6" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
