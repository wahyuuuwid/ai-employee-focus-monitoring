import Navbar from "../components/Navbar";
import WebcamCard from "../components/WebcamCard";
import EmotionCard from "../components/EmotionCard";
import ConfidenceBar from "../components/ConfidenceBar";
import AlertBox from "../components/AlertBox";
import StatsCard from "../components/StatsCard";
import { useEffect } from "react";
import { useFocusAI } from "../hook/useFocusModel";

import API from "../services/api";

export default function Dashboard() {

  const {
    videoRef,
    canvasRef,
    status,
    focusScore,
    notFocusScore,
    duration,
  } = useFocusAI();

  const emotionMap = {

    FOCUS: {
      label: "Fokus",
      color: "#2EC4B6",
    },

    NOT_FOCUS: {
      label: "Tidak Fokus",
      color: "#EF476F",
    },

    Detecting: {
      label: "Mendeteksi",
      color: "#FFB703",
    },

    Loading: {
      label: "Loading",
      color: "#5B2A86",
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

    <div className="min-h-screen bg-[#F5FBFB]">

      <Navbar />

      <div className="max-w-7xl mx-auto p-10">

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2">

            <WebcamCard
              videoRef={videoRef}
              canvasRef={canvasRef}
              status={status}
            />

          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-6">

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
        <div className="grid md:grid-cols-3 gap-6 mt-8">

          <StatsCard
            title="Focus Score"
            value={`${focusScore}%`}
          />

          <StatsCard
            title="Not Focus"
            value={`${notFocusScore}%`}
          />

          <StatsCard
            title="Distracted Time"
            value={`${duration}s`}
          />

        </div>

      </div>

    </div>
  );
}