type Props = {
  emotion: string;
};

export default function AlertBox({
  emotion,
}: Props) {

  if (
    emotion !== "Ngantuk" &&
    emotion !== "Stress"
  ) {
    return null;
  }

  return (
    <div
      className="
      rounded-3xl
      p-5
      border
      "
      style={{
        backgroundColor: "#FFF5F7",
        borderColor: "#FFD4DD",
      }}
    >

      <h2
        className="text-xl font-semibold"
        style={{
          color: "#EF476F",
        }}
      >
        Peringatan
      </h2>

      <p
        className="mt-2"
        style={{
          color: "#5C6B73",
        }}
      >

        {emotion === "Ngantuk"
          ? "Pengguna terlihat mengantuk."
          : "Pengguna terlihat stress."}

      </p>

    </div>
  );
}