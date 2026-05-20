type Props = {
  status: string;
  duration: number;
};

export default function AlertBox({
  status,
  duration,
}: Props) {

  // =========================
  // HIDE ALERT
  // =========================
  if (status !== "NOT FOCUS") {
    return null;
  }

  // =========================
  // ALERT LEVEL
  // =========================
  const isCritical = duration >= 10;

  return (
    <div
      className="
      rounded-3xl
      p-5
      border
      "
      style={{
        backgroundColor: isCritical
          ? "#FFF1F2"
          : "#FFF8EB",

        borderColor: isCritical
          ? "#FFD4DD"
          : "#FFE0A3",
      }}
    >
      <h2
        className="text-xl font-semibold"
        style={{
          color: isCritical
            ? "#EF476F"
            : "#FFB703",
        }}
      >
        {isCritical
          ? "Critical Alert"
          : "Warning"}
      </h2>

      <p
        className="mt-2"
        style={{
          color: "#5C6B73",
        }}
      >
        {isCritical
          ? `Pengguna kehilangan fokus selama ${duration} detik.`
          : "Pengguna mulai kehilangan fokus."}
      </p>
    </div>
  );
}