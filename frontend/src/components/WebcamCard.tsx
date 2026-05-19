export default function WebcamCard() {
  return (
    <div
      className="
      rounded-3xl
      p-6
      border
      shadow-sm
      "
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: "#D7EEEE",
      }}
    >

      <div className="flex justify-between items-center mb-5">

        <div>

          <h2
            className="text-2xl font-bold"
            style={{
              color: "#0B1320",
            }}
          >
            Monitoring Kamera
          </h2>

          <p
            style={{
              color: "#5C6B73",
            }}
          >
            Real-time webcam monitoring
          </p>

        </div>

        <div
          className="
          px-4
          py-2
          rounded-full
          text-sm
          font-semibold
          "
          style={{
            backgroundColor: "#2EC4B620",
            color: "#2EC4B6",
          }}
        >
          Aktif
        </div>

      </div>

      <div
        className="
        h-[420px]
        rounded-3xl
        flex
        items-center
        justify-center
        border
        "
        style={{
          backgroundColor: "#F4FBFB",
          borderColor: "#D7EEEE",
        }}
      >

        <p
          className="text-lg"
          style={{
            color: "#5C6B73",
          }}
        >
          Webcam Stream
        </p>

      </div>

    </div>
  );
}