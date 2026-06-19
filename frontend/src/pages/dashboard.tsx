import AppShell from "../components/layout/AppShell";
import WebcamCard from "../components/WebcamCard";
import EmotionCard from "../components/EmotionCard";
import ConfidenceBar from "../components/ConfidenceBar";
import AlertBox from "../components/AlertBox";
import StatsCard from "../components/StatsCard";
import { Gauge, EyeOff, TimerOff } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFocusAI } from "../hook/useFocusModel";

import API from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();

  const {
    videoRef,
    canvasRef,
    status,
    focusScore,
    notFocusScore,
    duration,
  } = useFocusAI();

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
    emotionMap[
      status as keyof typeof emotionMap
    ] || emotionMap.Detecting;

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
        <div className="flex flex-col gap-5">

          <EmotionCard
            emotion={current.label}
            color={current.color}
          />

          <ConfidenceBar value={focusScore} />

          <AlertBox
            status={status}
            duration={duration}
          />

        </div>

      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-5 mt-6">

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
          title="Distracted Time"
          value={`${duration}s`}
          icon={<TimerOff size={18} />}
          accent="#F59E0B"
        />

      </div>
    </AppShell>
  );
}
