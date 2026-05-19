type Props = {
  value: number;
};

export default function ProgressFocus({
  value,
}: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">

      <div className="flex justify-between mb-3">

        <p className="text-slate-500">
          Tingkat Fokus
        </p>

        <p className="font-semibold text-slate-700">
          {value}%
        </p>

      </div>

      <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden">

        <div
          className="bg-blue-500 h-4 rounded-full transition-all duration-500"
          style={{
            width: `${value}%`,
          }}
        ></div>

      </div>

    </div>
  );
}