import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div
      className="
      w-full
      px-10
      py-5
      flex
      justify-between
      items-center
      border-b
      bg-white
      "
      style={{
        borderColor: "#D7EEEE",
      }}
    >

      <div>

        <h1
          className="text-2xl font-bold"
          style={{
            color: "#0B1320",
          }}
        >
          AI Employee Focus
        </h1>

        <p
          className="text-sm"
          style={{
            color: "#5C6B73",
          }}
        >
          Monitoring System
        </p>

      </div>

      <div
        className="
        flex
        items-center
        gap-14
        font-medium
        "
        style={{
          color: "#5C6B73",
        }}
      >

        <Link
          to="/"
          className="transition hover:text-[#2EC4B6]"
        >
          Dashboard
        </Link>

        <Link
          to="/history"
          className="transition hover:text-[#2EC4B6]"
        >
          Riwayat
        </Link>

        <Link
          to="/statistics"
          className="transition hover:text-[#2EC4B6]"
        >
          Statistik
        </Link>

        <button
          onClick={handleLogout}
          className="transition hover:text-[#EF476F] font-medium"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#5C6B73",
          }}
        >
          Logout
        </button>

      </div>

    </div>
  );
}