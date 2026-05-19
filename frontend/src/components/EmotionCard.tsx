type Props = {
  emotion: string;
};

export default function EmotionCard({
  emotion,
}: Props) {

  const color =
    emotion === "Fokus"
      ? "#2EC4B6"
      : emotion === "Ngantuk"
      ? "#FFB703"
      : emotion === "Stress"
      ? "#EF476F"
      : "#5B2A86";

  return (
    <div
      className="
      rounded-3xl
      p-6
      border
      "
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: "#D7EEEE",
      }}
    >

      <p
        className="mb-3"
        style={{
          color: "#5C6B73",
        }}
      >
        Kondisi Pengguna
      </p>

      <h1
        className="text-3xl font-bold"
        style={{
          color,
        }}
      >
        {emotion}
      </h1>

    </div>
  );
}