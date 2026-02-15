import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Recycle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function parseJsonResponse(r) {
  const text = await r.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

export const ForgotPasswordPage = () => {
  const [step, setStep] = useState("request"); // request -> verify -> reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRequest = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await parseJsonResponse(r);
      if (!r.ok) {
        throw new Error(data.error || "Failed to send reset code");
      }
      setMessage("We sent a 6-digit code to your email. Check your inbox.");
      setStep("verify");
    } catch (err) {
      setError(err.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await parseJsonResponse(r);
      if (!r.ok || !data.resetToken) {
        throw new Error(data.error || "Invalid code");
      }
      setResetToken(data.resetToken);
      setMessage("Code verified. Set your new password.");
      setStep("reset");
    } catch (err) {
      setError(err.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!newPassword || newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, newPassword }),
      });
      const data = await parseJsonResponse(r);
      if (!r.ok) {
        throw new Error(data.error || "Failed to reset password");
      }
      setMessage("Password updated. You can now log in.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen w-full flex-col justify-center items-center p-4 overflow-x-hidden"
      style={{ fontFamily: "Inter, sans-serif", backgroundColor: "#0f172a" }}
    >
      <main className="relative z-10 flex flex-1 flex-col justify-center items-center w-full max-w-md">
        <div className="flex flex-col w-full items-center gap-6 rounded-xl bg-white/95 backdrop-blur-sm shadow-xl p-8 border border-white/20">
          <div className="flex items-center gap-3">
            <Recycle size={32} style={{ color: "#17563a" }} />
            <span className="text-3xl font-bold" style={{ color: "#0f172a" }}>
              EcoBot
            </span>
          </div>
          <div className="w-full text-center">
            <h1
              className="tracking-tight text-[26px] font-bold leading-tight pb-2 pt-4"
              style={{ color: "#0f172a" }}
            >
              Reset your password
            </h1>
            <p className="text-sm" style={{ color: "#475569" }}>
              Enter your email, then the 6-digit code we send, and finally your new password.
            </p>
          </div>

          {message && (
            <p className="text-sm text-green-700 bg-green-50 p-2 rounded-lg w-full text-left">
              {message}
            </p>
          )}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg w-full text-left">
              {error}
            </p>
          )}

          {step === "request" && (
            <form onSubmit={handleRequest} className="flex w-full flex-col items-stretch gap-4 pt-4">
              <label className="flex flex-col flex-1">
                <p
                  className="text-base font-medium leading-normal pb-2"
                  style={{ color: "#1e293b" }}
                >
                  Email Address
                </p>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg focus:outline-0 focus:ring-2 border bg-white h-12 placeholder:text-opacity-60 p-[15px] text-base font-normal leading-normal"
                  style={{
                    color: "#0f172a",
                    borderColor: "#cbd5e1",
                    "--tw-ring-color": "rgba(23, 86, 58, 0.5)",
                  }}
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex h-12 w-full items-center justify-center rounded-lg text-white text-base font-bold leading-normal transition-colors hover:opacity-90 disabled:opacity-70"
                style={{ backgroundColor: "#17563a" }}
              >
                {loading ? "Sending code..." : "Send reset code"}
              </button>
            </form>
          )}

          {step === "verify" && (
            <form onSubmit={handleVerify} className="flex w-full flex-col items-stretch gap-4 pt-4">
              <label className="flex flex-col flex-1">
                <p
                  className="text-base font-medium leading-normal pb-2"
                  style={{ color: "#1e293b" }}
                >
                  6-digit code
                </p>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg focus:outline-0 focus:ring-2 border bg-white h-12 placeholder:text-opacity-60 p-[15px] text-base font-mono leading-normal tracking-[0.3em]"
                  style={{
                    color: "#0f172a",
                    borderColor: "#cbd5e1",
                    "--tw-ring-color": "rgba(23, 86, 58, 0.5)",
                  }}
                  placeholder="000000"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\\D/g, ""))}
                  required
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex h-12 w-full items-center justify-center rounded-lg text-white text-base font-bold leading-normal transition-colors hover:opacity-90 disabled:opacity-70"
                style={{ backgroundColor: "#17563a" }}
              >
                {loading ? "Verifying..." : "Verify code"}
              </button>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handleReset} className="flex w-full flex-col items-stretch gap-4 pt-4">
              <label className="flex flex-col flex-1">
                <p
                  className="text-base font-medium leading-normal pb-2"
                  style={{ color: "#1e293b" }}
                >
                  New password
                </p>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg focus:outline-0 focus:ring-2 border bg-white h-12 placeholder:text-opacity-60 p-[15px] text-base font-normal leading-normal"
                  style={{
                    color: "#0f172a",
                    borderColor: "#cbd5e1",
                    "--tw-ring-color": "rgba(23, 86, 58, 0.5)",
                  }}
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </label>
              <label className="flex flex-col flex-1">
                <p
                  className="text-base font-medium leading-normal pb-2"
                  style={{ color: "#1e293b" }}
                >
                  Confirm password
                </p>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg focus:outline-0 focus:ring-2 border bg-white h-12 placeholder:text-opacity-60 p-[15px] text-base font-normal leading-normal"
                  style={{
                    color: "#0f172a",
                    borderColor: "#cbd5e1",
                    "--tw-ring-color": "rgba(23, 86, 58, 0.5)",
                  }}
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex h-12 w-full items-center justify-center rounded-lg text-white text-base font-bold leading-normal transition-colors hover:opacity-90 disabled:opacity-70"
                style={{ backgroundColor: "#17563a" }}
              >
                {loading ? "Updating..." : "Update password"}
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-4 text-sm font-medium hover:underline"
            style={{ color: "#17563a" }}
          >
            Back to login
          </button>
        </div>
        <div className="pt-6 text-center">
          <p className="text-xs font-normal" style={{ color: "#cbd5f5" }}>
            © 2026 EcoBot. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
};

