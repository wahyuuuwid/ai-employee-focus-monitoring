type Props = {
  status: string;
};

export default function StatusCard({
  status,
}: Props) {

  const isFocus = status === "Focus";

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">

      <p className="text-slate-500 mb-2">
        Status Saat Ini
      </p>

      <h1
        className={`text-3xl font-bold ${
          isFocus
            ? "text-green-500"
            : "text-red-500"
        }`}
      >
        {status}
      </h1>

    </div>
  );
}