import Navbar from "../components/Navbar";

type HistoryType = {
  waktu: string;
  kondisi: string;
  skor: string;
};

export default function History() {

  const data: HistoryType[] = [
    {
      waktu: "08:00",
      kondisi: "Fokus",
      skor: "94%",
    },
    {
      waktu: "08:30",
      kondisi: "Ngantuk",
      skor: "71%",
    },
    {
      waktu: "09:00",
      kondisi: "Stress",
      skor: "63%",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4FBFB]">

      <Navbar />

      <div className="max-w-7xl mx-auto p-10">

        <div
          className="
          rounded-3xl
          border
          p-8
          "
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "#D7EEEE",
          }}
        >

          <h1
            className="text-3xl font-bold mb-8"
            style={{
              color: "#0B1320",
            }}
          >
            Riwayat Monitoring
          </h1>

          <table className="w-full">

            <thead>

              <tr
                className="border-b"
                style={{
                  borderColor: "#D7EEEE",
                  color: "#5C6B73",
                }}
              >

                <th className="text-left py-4">
                  Waktu
                </th>

                <th className="text-left py-4">
                  Kondisi
                </th>

                <th className="text-left py-4">
                  Persentase
                </th>

              </tr>

            </thead>

            <tbody>

              {data.map((item, index) => (

                <tr
                  key={index}
                  className="border-b"
                  style={{
                    borderColor: "#D7EEEE",
                  }}
                >

                  <td
                    className="py-5"
                    style={{
                      color: "#5C6B73",
                    }}
                  >
                    {item.waktu}
                  </td>

                  <td
                    className="py-5 font-semibold"
                    style={{
                      color: "#0B1320",
                    }}
                  >
                    {item.kondisi}
                  </td>

                  <td
                    className="py-5 font-semibold"
                    style={{
                      color: "#2EC4B6",
                    }}
                  >
                    {item.skor}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}