type Props = {
  value: number;
};

export default function ConfidenceBar({
  value,
}: Props) {

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

      <div className="flex justify-between mb-4">

        <p
          style={{
            color: "#5C6B73",
          }}
        >
          Tingkat Akurasi
        </p>

        <p
          className="font-semibold"
          style={{
            color: "#0B1320",
          }}
        >
          {value}%
        </p>

      </div>

      <div
        className="
        w-full
        h-4
        rounded-full
        overflow-hidden
        "
        style={{
          backgroundColor: "#D7EEEE",
        }}
      >

        <div
          className="
          h-4
          rounded-full
          transition-all
          duration-500
          "
          style={{
            width: `${value}%`,
            backgroundColor: "#2EC4B6",
          }}
        ></div>

      </div>

    </div>
  );
}