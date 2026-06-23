import AppShell from "../components/layout/AppShell";
import WebcamCard from "../components/WebcamCard";
import EmotionCard from "../components/EmotionCard";
import ConfidenceBar from "../components/ConfidenceBar";
import AlertBox from "../components/AlertBox";
import StatsCard from "../components/StatsCard";
import {
  Gauge,
  EyeOff,
  TimerOff,
  BriefcaseBusiness,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFocusAI } from "../hook/useFocusModel";

import API from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [workDuration, setWorkDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWorkDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}j ${m}m`;
  };
  const { videoRef, canvasRef, status, focusScore, notFocusScore, duration } =
    useFocusAI();

  // Check if token exists, if not redirect to login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const emotionMap = {
    FOCUS: {
      label: "Fokus",
      color: "#10B981",
    },

    NOT_FOCUS: {
      label: "Tidak Fokus",
      color: "#EF4444",
    },

    Detecting: {
      label: "Mendeteksi",
      color: "#F59E0B",
    },

    Loading: {
      label: "Loading",
      color: "#2563EB",
    },
  };

  const current =
    emotionMap[status as keyof typeof emotionMap] || emotionMap.Detecting;
  const getInsight = (): { title: string; message: string; color: string } => {
    if (status === "FOCUS") {
      if (focusScore >= 80)
        return {
          title: "Luar Biasa!",
          message:
            "Fokus kamu sangat tinggi hari ini. Pertahankan ritme ini, kamu sedang dalam kondisi terbaik!",
          color: "#10B981",
        };
      if (focusScore >= 60)
        return {
          title: "Bagus!",
          message:
            "Fokus kamu cukup baik. Hindari membuka media sosial agar tetap produktif.",
          color: "#10B981",
        };
      return {
        title: "Fokus Terjaga",
        message:
          "Kamu sedang fokus. Manfaatkan momentum ini untuk menyelesaikan tugas prioritas.",
        color: "#10B981",
      };
    }

    if (status === "NOT FOCUS") {
      if (duration >= 30)
        return {
          title: "Perhatian!",
          message:
            "Kamu sudah tidak fokus lebih dari 30 detik. Segera singkirkan distraksi dan tarik napas dalam.",
          color: "#EF4444",
        };
      if (duration >= 10)
        return {
          title: "Waspada!",
          message:
            "Fokus kamu mulai terganggu. Coba tutup tab yang tidak perlu dan kembali ke pekerjaan.",
          color: "#F59E0B",
        };
      return {
        title: "Hampir Tidak Fokus",
        message:
          "Kamu mulai kehilangan fokus. Yuk kembali ke pekerjaan sebelum makin terdistraksi!",
        color: "#F59E0B",
      };
    }

    return {
      title: "Mendeteksi...",
      message:
        "Sistem sedang membaca kondisi kamu. Pastikan wajah terlihat jelas di kamera.",
      color: "#2563EB",
    };
  };

  const insight = getInsight();

  // =========================
  // SAVE TO BACKEND
  // =========================

  const saveMonitoring = async () => {
    try {
      await API.post("/monitoring", {
        status,
        focus_score: focusScore,
      });

      console.log("Monitoring saved");
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // AUTO SAVE EVERY 5 SEC
  // =========================

  useEffect(() => {
    const interval = setInterval(() => {
      if (focusScore > 0) {
        saveMonitoring();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [status, focusScore]);

  return (
    <AppShell
      title="Monitoring Fokus Karyawan"
      subtitle="Kelola performa dan fokus kerja karyawan secara real-time"
      variant="employee"
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2">
          <WebcamCard
            videoRef={videoRef}
            canvasRef={canvasRef}
            status={status}
          />
        </div>
        {/* RIGHT */}
        {/* RIGHT */}
        <div className="flex flex-col gap-5">
          <EmotionCard emotion={current.label} color={current.color} />
          <ConfidenceBar value={focusScore} />
          <AlertBox status={status} duration={duration} />
          <div
            className="rounded-2xl border p-5"
            style={{
              borderColor: `${insight.color}30`,
              backgroundColor: `${insight.color}08`,
            }}
          >
            <p
              className="text-sm font-bold mb-1"
              style={{ color: insight.color }}
            >
              {insight.title}
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">
              {insight.message}
            </p>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-6">
        <StatsCard
          title="Focus Score"
          value={`${focusScore}%`}
          icon={<Gauge size={18} />}
          accent="#10B981"
        />

        <StatsCard
          title="Not Focus"
          value={`${notFocusScore}%`}
          icon={<EyeOff size={18} />}
          accent="#EF4444"
        />

        <StatsCard
          title="Waktu Terdisraksi"
          value={`${duration}s`}
          icon={<TimerOff size={18} />}
          accent="#F59E0B"
        />

        <StatsCard
          title="Total Durasi Kerja"
          value={formatDuration(workDuration)}
          icon={<BriefcaseBusiness size={18} />}
          accent="#2563EB"
        />
      </div>
    </AppShell>
  );
}
