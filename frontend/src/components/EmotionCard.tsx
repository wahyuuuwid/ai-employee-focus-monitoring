type Props = {
  emotion: string;
  color: string;
};

export default function EmotionCard({
  emotion,
  color,
}: Props) {
  return (
    <div
      className="
      rounded-3xl
      p-6
      border
      bg-white
      "
      style={{
        borderColor: "#D7EEEE",
      }}
    >
      <p
        className="mb-3 text-sm"
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