type Props = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  status: string;
};

export default function WebcamCard({
  videoRef,
  canvasRef,
  status,
}: Props) {
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
        h-[500px]
        rounded-2xl
        overflow-hidden
        bg-[#EEF7F7]
        "
      >
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

      <canvas
        ref={canvasRef}
        width={160}
        height={160}
        className="hidden"
      />

  
      <div className="mt-4 flex items-center gap-3">
        <div
          className={`
          w-3
          h-3
          rounded-full
          ${
            status === "FOCUS"
              ? "bg-green-400"
              : status === "NOT FOCUS"
              ? "bg-red-400"
              : "bg-yellow-400"
          }
          `}
        />

        <p className="text-sm text-[#5C6B73]">
          {status}
        </p>
      </div>
    </div>
  );
}