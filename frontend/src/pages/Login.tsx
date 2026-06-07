import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/login", { email, password });
      if (res.status === 200) {
        localStorage.setItem("user_id", res.data.user_id);
        navigate("/");
      }
    } catch (err: any) {
      setError("Email atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', sans-serif",
        padding: "20px",
      }}
    >
      {/* Background grid effect */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(46,196,182,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(46,196,182,0.05) 1px, transparent 5px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo / Header */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #ffffff, #ffffff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 0 32px rgba(46,196,182,0.4)",
              fontSize: "28px",
            }}
          >
            <img src="/favicon.svg" width="36" height="36" />
          </div>
          <h1
            style={{
              color: "#ffffff",
              fontSize: "24px",
              fontWeight: 700,
              margin: "0 0 6px",
              letterSpacing: "-0.5px",
            }}
          >
            AI Employee Focus Monitoring
          </h1>
          <p style={{ color: "#8892a4", fontSize: "14px", margin: 0 }}>
            Masuk untuk mulai monitoring
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(46,196,182,0.2)",
            borderRadius: "20px",
            padding: "36px",
            backdropFilter: "blur(20px)",
            boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
          }}
        >
          {/* Error message */}
          {error && (
            <div
              style={{
                background: "rgba(255,80,80,0.12)",
                border: "1px solid rgba(255,80,80,0.3)",
                borderRadius: "10px",
                padding: "12px 16px",
                color: "#ff6b6b",
                fontSize: "14px",
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                color: "#a0aec0",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "8px",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Ketik alamat email"
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: "#ffffff",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(46,196,182,0.6)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.1)")
              }
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "28px" }}>
            <label
              style={{
                display: "block",
                color: "#a0aec0",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "8px",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: "#ffffff",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(46,196,182,0.6)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.1)")
              }
            />
          </div>

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading
                ? "rgba(46,196,182,0.4)"
                : "linear-gradient(135deg, #2EC4B6, #0a8a82)",
              border: "none",
              borderRadius: "10px",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: "0.5px",
              boxShadow: loading ? "none" : "0 4px 20px rgba(46,196,182,0.4)",
              transition: "all 0.2s",
            }}
          >
            {loading ? "Masuk..." : "Masuk"}
          </button>

          {/* Hint */}
          <p
            style={{
              color: "#4a5568",
              fontSize: "12px",
              textAlign: "center",
              marginTop: "20px",
              marginBottom: 0,
            }}
          ></p>
        </div>
      </div>
    </div>
  );
}
