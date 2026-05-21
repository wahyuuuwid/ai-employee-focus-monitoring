type Props = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  status: string;
  cameraReady: boolean;
};

export default function WebcamCard({
  videoRef,
  canvasRef,
  status,
  cameraReady,
}: Props) {
  const isFocus = status === "FOCUS";

  const isNotFocus = status === "NOT FOCUS";

  const glowColor = isFocus
    ? "0 0 0 3px #2EC4B6, 0 0 24px 4px #2EC4B644"
    : isNotFocus
      ? "0 0 0 3px #EF476F, 0 0 24px 4px #EF476F44"
      : "0 0 0 3px #D7EEEE";

  return (
    <div
      className="
      bg-white
      rounded-3xl
      border
      p-6
      h-full
      "
      style={{
        borderColor: "#D7EEEE",
      }}
    >
      {/* VIDEO */}
      <div
        className="
        w-full
        h-[320px]
        rounded-2xl
        overflow-hidden
        bg-[#EEF7F7]
        relative
        transition-all
        duration-700
        "
        style={{
          boxShadow: glowColor,
        }}
      >
        {!cameraReady && (
          <div
            className="
            absolute
            inset-0
            flex
            flex-col
            items-center
            justify-center
            gap-3
            z-10
            "
            style={{
              backgroundColor: "#EEF7F7",
            }}
          >
            <div
              className="
              w-10
              h-10
              rounded-full
              border-4
              animate-spin
              "
              style={{
                borderColor: "#D7EEEE",
                borderTopColor: "#2EC4B6",
              }}
            />

            <p
              className="text-sm"
              style={{
                color: "#5C6B73",
              }}
            >
              {status === "Camera Error"
                ? "Gagal mengakses kamera"
                : "Menyiapkan kamera..."}
            </p>
          </div>
        )}

        {cameraReady && (isFocus || isNotFocus) && (
          <div
            className="
            absolute
            top-3
            right-3
            z-10
            px-3
            py-1
            rounded-full
            text-xs
            font-semibold
            "
            style={{
              backgroundColor: isFocus ? "#2EC4B6" : "#EF476F",
              color: "#FFFFFF",
            }}
          >
            {isFocus ? "FOKUS" : "TIDAK FOKUS"}
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="
          w-full
          h-full
          object-cover
          "
        />
      </div>

      <canvas ref={canvasRef} width={160} height={160} className="hidden" />
    </div>
  );
}
