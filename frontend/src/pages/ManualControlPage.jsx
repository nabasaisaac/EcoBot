import { useState, useEffect, useRef } from "react";
import { Sidebar } from "../components/Sidebar";
import {
  Play,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Pause,
  Recycle,
  AlertTriangle,
  Battery,
  Signal,
  RefreshCw,
  Bot,
} from "lucide-react";

// Try Node.js API first, fallback to Flask directly
const NODE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const FLASK_API_URL = "http://localhost:5000";

// Function to determine which API to use
const getApiUrl = async () => {
  try {
    // Try Node.js API first
    const response = await fetch(`${NODE_API_URL}/api/health`, {
      method: "GET",
      signal: AbortSignal.timeout(2000), // 2 second timeout
    });
    if (response.ok) {
      return NODE_API_URL;
    }
  } catch (err) {
    console.log("Node.js API not available, trying Flask directly");
  }
  
  // Fallback to Flask
  try {
    const response = await fetch(`${FLASK_API_URL}/api/health`, {
      method: "GET",
      signal: AbortSignal.timeout(2000),
    });
    if (response.ok) {
      return FLASK_API_URL;
    }
  } catch (err) {
    console.log("Flask API not available");
  }
  
  // Default to Node.js (will show error if not available)
  return NODE_API_URL;
};

export const ManualControlPage = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiUrl, setApiUrl] = useState(NODE_API_URL);
  const videoRef = useRef(null);

  useEffect(() => {
    // Detect which API is available
    getApiUrl().then((url) => {
      setApiUrl(url);
    });
    
    // Cleanup on unmount
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCamera = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Try to detect API if not set
      const currentApiUrl = apiUrl || await getApiUrl();
      setApiUrl(currentApiUrl);

      // Start camera on backend
      const response = await fetch(`${currentApiUrl}/api/camera/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success" || data.status === "already_streaming") {
        setIsStreaming(true);

        // Set video source to stream endpoint
        if (videoRef.current) {
          videoRef.current.src = `${currentApiUrl}/api/camera/stream?t=${Date.now()}`;
        }
      } else {
        setError(data.message || "Failed to start camera");
        setIsStreaming(false);
      }
    } catch (err) {
      console.error("Error starting camera:", err);
      setError(
        `Failed to connect to camera. Make sure Flask API is running on port 5000. Error: ${err.message}`
      );
      setIsStreaming(false);
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = async () => {
    try {
      const currentApiUrl = apiUrl || FLASK_API_URL;
      const response = await fetch(`${currentApiUrl}/api/camera/stop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setIsStreaming(false);
        if (videoRef.current) {
          videoRef.current.src = "";
        }
      }
    } catch (err) {
      console.error("Error stopping camera:", err);
    }
  };

  const handleStart = () => {
    if (!isStreaming) {
      startCamera();
    }
  };

  const handleStop = () => {
    if (isStreaming) {
      stopCamera();
    }
  };

  return (
    <div
      className="relative flex w-full min-h-screen"
      style={{ backgroundColor: "#f0f2f5", fontFamily: "Inter, sans-serif" }}
    >
      <Sidebar variant="manual-control" />
      <main className="flex-1 p-8">
        <div className="flex flex-col gap-8">
          <header className="flex flex-wrap justify-between gap-3">
            <div className="flex flex-col gap-1">
              <p
                className="text-3xl font-bold leading-tight"
                style={{ color: "#111827" }}
              >
                Manual Robot Control
              </p>
              <p
                className="text-base font-normal leading-normal"
                style={{ color: "#6b7280" }}
              >
                Real-time remote operation of ARC-007
              </p>
            </div>
          </header>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="flex flex-col gap-2 lg:col-span-2">
              <div className="flex items-center justify-between">
                <p
                  className="text-sm font-medium leading-normal"
                  style={{ color: "#6b7280" }}
                >
                  Live Camera Feed
                </p>
                <p
                  className="text-sm font-normal leading-normal"
                  style={{ color: "#6b7280" }}
                >
                  {isStreaming ? "Streaming..." : "Stopped"}
                </p>
              </div>
              <div className="relative flex items-center justify-center overflow-hidden bg-gray-900 aspect-video rounded-xl">
                {isStreaming ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="object-cover w-full h-full"
                    style={{ backgroundColor: "#000000" }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    {error ? (
                      <div className="p-4 text-center">
                        <p className="mb-2 text-sm text-red-400">{error}</p>
                        <p className="text-xs text-gray-400">
                          Make sure Flask API is running on port 5000
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={handleStart}
                        disabled={isLoading}
                        className="flex items-center justify-center text-white transition-colors rounded-full shrink-0 size-16 bg-black/50 backdrop-blur-sm hover:bg-black/70 disabled:opacity-50"
                      >
                        <Play size={40} fill="#ffffff" />
                      </button>
                    )}
                  </div>
                )}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-sm text-white">Starting camera...</div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div
                className="p-6 bg-white border rounded-xl"
                style={{ borderColor: "#e5e7eb" }}
              >
                <h2
                  className="mb-6 text-xl font-semibold leading-tight"
                  style={{ color: "#111827" }}
                >
                  Controls
                </h2>
                <div className="flex items-center justify-center mb-6">
                  <div
                    className="relative flex items-center justify-center w-48 h-48 border rounded-full"
                    style={{
                      backgroundColor: "#f0f2f5",
                      borderColor: "#e5e7eb",
                    }}
                  >
                    <div
                      className="absolute w-full h-full"
                      style={{ color: "#9ca3af" }}
                    >
                      <div className="absolute left-0 p-2 -translate-x-1/2 -translate-y-1/2 top-1/2">
                        <ArrowLeft size={24} />
                      </div>
                      <div className="absolute right-0 p-2 translate-x-1/2 -translate-y-1/2 top-1/2">
                        <ArrowRight size={24} />
                      </div>
                      <div className="absolute top-0 p-2 -translate-x-1/2 -translate-y-1/2 left-1/2">
                        <ArrowUp size={24} />
                      </div>
                      <div className="absolute bottom-0 p-2 -translate-x-1/2 translate-y-1/2 left-1/2">
                        <ArrowDown size={24} />
                      </div>
                    </div>
                    <div
                      className="w-24 h-24 rounded-full shadow-lg cursor-grab active:cursor-grabbing"
                      style={{ backgroundColor: "#17563a" }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleStart}
                    disabled={isStreaming || isLoading}
                    className="flex items-center justify-center col-span-1 gap-2 px-4 py-3 font-semibold text-white transition-colors rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "#17563a" }}
                  >
                    <Play size={20} /> Start
                  </button>
                  <button
                    onClick={handleStop}
                    disabled={!isStreaming}
                    className="flex items-center justify-center col-span-1 gap-2 px-4 py-3 font-semibold transition-colors rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "#e5e7eb", color: "#111827" }}
                  >
                    <Pause size={20} /> Stop
                  </button>
                  <button
                    className="flex items-center justify-center col-span-2 gap-2 px-4 py-3 font-medium transition-colors rounded-md hover:bg-gray-300"
                    style={{ backgroundColor: "#e5e7eb", color: "#111827" }}
                  >
                    <Recycle size={20} /> Collect Rubbish
                  </button>
                  <button className="flex items-center justify-center col-span-2 gap-2 px-4 py-3 font-bold text-white transition-colors bg-red-600 rounded-md hover:bg-red-700">
                    <AlertTriangle size={20} /> EMERGENCY STOP
                  </button>
                </div>
              </div>
              <div
                className="p-6 bg-white border rounded-xl"
                style={{ borderColor: "#e5e7eb" }}
              >
                <h2
                  className="mb-4 text-xl font-semibold leading-tight"
                  style={{ color: "#111827" }}
                >
                  Live Status
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center gap-3"
                      style={{ color: "#6b7280" }}
                    >
                      <Battery size={20} style={{ color: "#17563a" }} />
                      <p className="text-sm">Battery Level</p>
                    </div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "#111827" }}
                    >
                      85%
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center gap-3"
                      style={{ color: "#6b7280" }}
                    >
                      <Signal size={20} style={{ color: "#17563a" }} />
                      <p className="text-sm">Signal Strength</p>
                    </div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "#111827" }}
                    >
                      {isStreaming ? "Excellent" : "Disconnected"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center gap-3"
                      style={{ color: "#6b7280" }}
                    >
                      <RefreshCw size={20} style={{ color: "#6b7280" }} />
                      <p className="text-sm">Motor Status</p>
                    </div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#111827" }}
                    >
                      {isStreaming ? "Active" : "Idle"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center gap-3"
                      style={{ color: "#6b7280" }}
                    >
                      <Bot size={20} style={{ color: "#6b7280" }} />
                      <p className="text-sm">Current Mode</p>
                    </div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#17563a" }}
                    >
                      Manual Control
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
