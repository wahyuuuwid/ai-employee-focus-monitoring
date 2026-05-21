import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import API from "../services/api";

type HistoryType = {
  id: number;
  status: string;
  focus_score: number;
  created_at: string;
};

export default function History() {

  const [history, setHistory] = useState<
    HistoryType[]
  >([]);

  const fetchHistory = async () => {

    try {

      const response =
        await API.get("/history");

      setHistory(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {

    fetchHistory();

    const interval = setInterval(() => {

      fetchHistory();

    }, 5000);

    return () => clearInterval(interval);

  }, []);

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

              {history.map((item) => (

                <tr
                  key={item.id}
                  className="border-b"
                  style={{
                    borderColor: "#D7EEEE",
                  }}
                >

                  <td className="py-5">
                    {item.created_at}
                  </td>

                  <td className="py-5">

                    <span
                      className={`
                        px-4 py-2 rounded-xl text-white
                        ${
                          item.status === "FOCUS"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }
                      `}
                    >
                      {item.status}
                    </span>

                  </td>

                  <td className="py-5 font-semibold">
                    {item.focus_score}%
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