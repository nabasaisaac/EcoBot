import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "../components/Sidebar";
import { Play, Pause, Battery, Radio, Activity } from "lucide-react";

const NODE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const FLASK_API_URL = "http://localhost:5000";
const STATUS_POLL_MS = 1500;

const getApiUrl = async () => {
  const fetchWithTimeout = (url, timeout = 2000) =>
    Promise.race([
      fetch(url, { method: "GET" }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), timeout)),
    ]);
  try {
    const r = await fetchWithTimeout(`${NODE_API_URL}/api/health`);
    if (r.ok) return NODE_API_URL;
  } catch {
    try {
      const r = await fetchWithTimeout(`${FLASK_API_URL}/api/health`);
      if (r.ok) return FLASK_API_URL;
    } catch {
      return FLASK_API_URL;
    }
  }
  return FLASK_API_URL;
};

export const ManualControlPage = () => {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiUrl, setApiUrl] = useState(NODE_API_URL);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [streamUrl, setStreamUrl] = useState(null);
  const [liveStatus, setLiveStatus] = useState(null);

  const fetchStatus = useCallback(async () => {
    const base = apiUrl || FLASK_API_URL;
    try {
      const r = await fetch(`${base}/api/status`);
      if (r.ok) {
        const data = await r.json();
        setLiveStatus(data);
      }
    } catch {
      setLiveStatus(null);
    }
  }, [apiUrl]);

  useEffect(() => {
    getApiUrl().then(setApiUrl);
    return () => {
      stopControl();
    };
  }, []);

  useEffect(() => {
    if (!isActive) {
      setLiveStatus(null);
      return;
    }
    fetchStatus();
    const id = setInterval(fetchStatus, STATUS_POLL_MS);
    return () => clearInterval(id);
  }, [isActive, fetchStatus]);

  const startControl = async () => {
    setIsLoading(true);
    setError(null);
    const base = apiUrl || (await getApiUrl());
    setApiUrl(base);
    try {
      const r = await fetch(`${base}/api/control/start`, { method: "POST", headers: { "Content-Type": "application/json" } });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || `HTTP ${r.status}`);
      if (data.status === "success" || data.status === "already_started") {
        setStreamUrl(`${base}/api/camera/stream?t=${Date.now()}`);
        setIsActive(true);
      } else {
        throw new Error(data.message || "Failed to start");
      }
    } catch (err) {
      setError(err.message || "Failed to start manual control. Ensure backend is running and robot/Xbox are connected.");
      setIsActive(false);
      setStreamUrl(null);
    } finally {
      setIsLoading(false);
    }
  };

  const stopControl = async () => {
    const base = apiUrl || FLASK_API_URL;
    try {
      await fetch(`${base}/api/control/stop`, { method: "POST", headers: { "Content-Type": "application/json" } });
      setIsActive(false);
      setStreamUrl(null);
    } catch (err) {
      console.error("Stop error:", err);
    }
  };

  return (
    <div className="relative flex w-full min-h-screen" style={{ backgroundColor: "#f0f2f5", fontFamily: "Inter, sans-serif" }}>
      <Sidebar variant="manual-control" isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className="flex-1 p-4 mt-16 lg:p-8 lg:mt-0">
        <div className="flex flex-col gap-8">
          <header>
            <h1 className="text-3xl font-bold" style={{ color: "#111827" }}>Manual Robot Control</h1>
            <p className="text-base text-gray-600">Drive with Xbox. Live feed shows trash detection and bounding boxes.</p>
          </header>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Live feed (trash + bounding boxes)</span>
              <span className="text-sm font-medium" style={{ color: isActive ? "#17563a" : "#6b7280" }}>
                {isActive ? "Active — use Xbox to control" : "Stopped"}
              </span>
            </div>
            <div className="relative flex items-center justify-center overflow-hidden bg-gray-900 aspect-video rounded-xl">
              {isActive && streamUrl ? (
                <img
                  src={streamUrl}
                  alt="Live camera with trash detection"
                  className="object-contain w-full h-full"
                  style={{ backgroundColor: "#000" }}
                  onError={() => setError("Stream failed. Is manual control running?")}
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
                  {error && <p className="mb-2 text-sm text-red-400">{error}</p>}
                  <p className="text-sm">Click Start to begin manual control and see the live stream.</p>
                  <button
                    onClick={startControl}
                    disabled={isLoading}
                    className="mt-4 flex items-center justify-center rounded-full size-16 bg-white/10 hover:bg-white/20 disabled:opacity-50 transition-colors"
                  >
                    <Play size={36} className="text-white" />
                  </button>
                </div>
              )}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="text-white">Starting manual control...</span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={startControl}
                disabled={isActive || isLoading}
                className="flex items-center gap-2 px-5 py-3 font-semibold text-white rounded-lg bg-[#17563a] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play size={20} /> Start
              </button>
              <button
                onClick={stopControl}
                disabled={!isActive}
                className="flex items-center gap-2 px-5 py-3 font-semibold rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Pause size={20} /> Stop
              </button>
            </div>

            {/* Live status cards: battery, sonar (cm), action (like autonomous_trash_picker) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border bg-white flex items-center justify-between" style={{ borderColor: "#e5e7eb" }}>
                <div className="flex items-center gap-3" style={{ color: "#6b7280" }}>
                  <Battery size={22} style={{ color: "#17563a" }} />
                  <p className="text-sm font-medium">Battery</p>
                </div>
                <p className="text-sm font-semibold" style={{ color: "#111827" }}>
                  {liveStatus?.battery_percent != null ? `${liveStatus.battery_percent}%` : liveStatus?.battery_voltage != null ? `${liveStatus.battery_voltage} V` : "—"}
                </p>
              </div>
              <div className="p-4 rounded-xl border bg-white flex items-center justify-between" style={{ borderColor: "#e5e7eb" }}>
                <div className="flex items-center gap-3" style={{ color: "#6b7280" }}>
                  <Radio size={22} style={{ color: "#17563a" }} />
                  <p className="text-sm font-medium">Sonar (cm)</p>
                </div>
                <p className="text-sm font-semibold" style={{ color: "#111827" }}>
                  {liveStatus?.sonar_cm != null ? `${liveStatus.sonar_cm} cm` : "—"}
                </p>
              </div>
              <div className="p-4 rounded-xl border bg-white flex items-center justify-between" style={{ borderColor: "#e5e7eb" }}>
                <div className="flex items-center gap-3" style={{ color: "#6b7280" }}>
                  <Activity size={22} style={{ color: "#17563a" }} />
                  <p className="text-sm font-medium">Action</p>
                </div>
                <p className="text-sm font-semibold truncate max-w-[140px]" style={{ color: "#111827" }} title={liveStatus?.action || ""}>
                  {liveStatus?.action ?? "—"}
                </p>
              </div>
            </div>
            {isActive && liveStatus && (
              <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                <span>Trash detected: {liveStatus.trash_count ?? 0}</span>
                <span>Mode: {liveStatus.mode ?? "—"}</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
