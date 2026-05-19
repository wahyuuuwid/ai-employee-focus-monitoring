type Props = {
  title: string;
  value: string;
};

export default function StatsCard({
  title,
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

      <p
        className="mb-3"
        style={{
          color: "#5C6B73",
        }}
      >
        {title}
      </p>

      <h1
        className="text-2xl font-bold"
        style={{
          color: "#0B1320",
        }}
      >
        {value}
      </h1>

    </div>
  );
}