import Navbar from "../components/Navbar";
import WebcamCard from "../components/WebcamCard";
import EmotionCard from "../components/EmotionCard";
import ConfidenceBar from "../components/ConfidenceBar";
import AlertBox from "../components/AlertBox";
import StatsCard from "../components/StatsCard";

export default function Dashboard() {

  const emotion = "Ngantuk";
  const confidence = 82;

  return (
    <div className="min-h-screen">

      <Navbar />

      <div className="max-w-7xl mx-auto p-10">

        <div className="grid lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2">
            <WebcamCard />
          </div>

          <div className="flex flex-col gap-6">

            <EmotionCard emotion={emotion} />

            <ConfidenceBar value={confidence} />

            <AlertBox emotion={emotion} />

          </div>

        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-8">

          <StatsCard
            title="Waktu Fokus"
            value="4 Jam"
          />

          <StatsCard
            title="Gangguan"
            value="12"
          />

          <StatsCard
            title="Akurasi"
            value="91%"
          />

        </div>

      </div>

    </div>
  );
}