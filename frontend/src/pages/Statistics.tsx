import Navbar from "../components/Navbar";

export default function Statistics() {

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
            Statistik Monitoring
          </h1>

          <div
            className="
            h-[500px]
            rounded-3xl
            border
            flex
            items-center
            justify-center
            "
            style={{
              backgroundColor: "#F4FBFB",
              borderColor: "#D7EEEE",
            }}
          >

            <p
              className="text-xl"
              style={{
                color: "#5C6B73",
              }}
            >
              Grafik Statistik
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}