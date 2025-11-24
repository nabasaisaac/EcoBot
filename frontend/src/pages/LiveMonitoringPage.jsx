import { Sidebar } from "../components/Sidebar";
import {
  ChevronDown,
  Bell,
  LogOut,
  Recycle,
  CheckCircle,
  AlertTriangle,
  Zap,
} from "lucide-react";

export const LiveMonitoringPage = () => {
  return (
    <div
      className="flex h-screen"
      style={{ fontFamily: "Space Grotesk, sans-serif" }}
    >
      <Sidebar />
      <main
        className="flex-1 overflow-y-auto p-8"
        style={{ backgroundColor: "#f7fafc" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <p
              className="text-4xl font-black leading-tight tracking-[-0.033em]"
              style={{ color: "#1a202c" }}
            >
              Live Monitoring Dashboard
            </p>
            <div className="flex items-center gap-4">
              <button
                className="flex h-10 items-center justify-center gap-x-2 rounded-lg border px-4"
                style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
              >
                <p
                  className="text-sm font-medium leading-normal"
                  style={{ color: "#1a202c" }}
                >
                  Robot: All
                </p>
                <ChevronDown size={20} style={{ color: "#4a5568" }} />
              </button>
              <button
                className="flex items-center justify-center size-10 rounded-lg border"
                style={{
                  backgroundColor: "#ffffff",
                  borderColor: "#e2e8f0",
                  color: "#4a5568",
                }}
              >
                <Bell size={20} />
              </button>
              <button
                className="flex items-center justify-center size-10 rounded-lg border"
                style={{
                  backgroundColor: "#ffffff",
                  borderColor: "#e2e8f0",
                  color: "#4a5568",
                }}
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div
                className="p-4 rounded-xl border"
                style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
              >
                <div
                  className="relative flex items-end justify-start bg-cover bg-center aspect-video rounded-lg p-4"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDazPRjgy9PmHGqrsiIcS9lTKv1fp6Xwz16f-_vPnfi0flhY8y2IetHEZVTwHpoPkMG57_YmA3ryFc1JNljDOvHZfo_mXV0LO5p10qkJDWcMlbi6abntRTocbaYvUhXGW-P5q-nt0gYMce6N3LgOz4BVfmHiu2zlggShF8TJGMPWSzmXKL4BtSFlEiHPTDZSzH_UwtuwdTFXynR1Cu4IM3C-u2xfrqcYjKl7YhCcGapGpPYZhhPQo4UFUHiIPnuc85-_CVVpgs24yY")',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
                  <div className="relative flex justify-between items-center w-full">
                    <div>
                      <h3 className="text-white font-bold text-lg">ROB-001</h3>
                      <p className="text-sm" style={{ color: "#86efac" }}>
                        Status: Collecting
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full bg-red-500 animate-pulse"></div>
                      <span className="text-white font-medium">REC</span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="p-6 rounded-xl border"
                style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
              >
                <h3
                  className="font-bold text-xl mb-4"
                  style={{ color: "#1a202c" }}
                >
                  Robot Vitals
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative size-24">
                      <svg
                        className="size-full"
                        height="36"
                        viewBox="0 0 36 36"
                        width="36"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          className="stroke-current"
                          cx="18"
                          cy="18"
                          fill="none"
                          r="16"
                          strokeWidth="3"
                          style={{ color: "#e5e7eb" }}
                        ></circle>
                        <circle
                          className="stroke-current"
                          cx="18"
                          cy="18"
                          fill="none"
                          r="16"
                          strokeDasharray="88"
                          strokeDashoffset="100"
                          strokeWidth="3"
                          style={{
                            strokeDashoffset: "calc(100 - (100 * 88) / 100)",
                            transform: "rotate(-90deg)",
                            transformOrigin: "50% 50%",
                            color: "#38a169",
                          }}
                        ></circle>
                      </svg>
                      <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-lg"
                        style={{ color: "#1a202c" }}
                      >
                        88%
                      </div>
                    </div>
                    <p className="text-sm" style={{ color: "#4a5568" }}>
                      Battery Level
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative size-24">
                      <svg
                        className="size-full"
                        height="36"
                        viewBox="0 0 36 36"
                        width="36"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          className="stroke-current"
                          cx="18"
                          cy="18"
                          fill="none"
                          r="16"
                          strokeWidth="3"
                          style={{ color: "#e5e7eb" }}
                        ></circle>
                        <circle
                          className="stroke-current"
                          cx="18"
                          cy="18"
                          fill="none"
                          r="16"
                          strokeDasharray="65"
                          strokeDashoffset="100"
                          strokeWidth="3"
                          style={{
                            strokeDashoffset: "calc(100 - (100 * 65) / 100)",
                            transform: "rotate(-90deg)",
                            transformOrigin: "50% 50%",
                            color: "#dd6b20",
                          }}
                        ></circle>
                      </svg>
                      <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-lg"
                        style={{ color: "#1a202c" }}
                      >
                        65%
                      </div>
                    </div>
                    <p className="text-sm" style={{ color: "#4a5568" }}>
                      Bin Capacity
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative size-24">
                      <svg
                        className="size-full"
                        height="36"
                        viewBox="0 0 36 36"
                        width="36"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          className="stroke-current"
                          cx="18"
                          cy="18"
                          fill="none"
                          r="16"
                          strokeWidth="3"
                          style={{ color: "#e5e7eb" }}
                        ></circle>
                        <circle
                          className="stroke-current"
                          cx="18"
                          cy="18"
                          fill="none"
                          r="16"
                          strokeDasharray="92"
                          strokeDashoffset="100"
                          strokeWidth="3"
                          style={{
                            strokeDashoffset: "calc(100 - (100 * 92) / 100)",
                            transform: "rotate(-90deg)",
                            transformOrigin: "50% 50%",
                            color: "#38a169",
                          }}
                        ></circle>
                      </svg>
                      <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-lg"
                        style={{ color: "#1a202c" }}
                      >
                        92%
                      </div>
                    </div>
                    <p className="text-sm" style={{ color: "#4a5568" }}>
                      Connectivity
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative size-24">
                      <svg
                        className="size-full"
                        height="36"
                        viewBox="0 0 36 36"
                        width="36"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          className="stroke-current"
                          cx="18"
                          cy="18"
                          fill="none"
                          r="16"
                          strokeWidth="3"
                          style={{ color: "#e5e7eb" }}
                        ></circle>
                        <circle
                          className="stroke-current"
                          cx="18"
                          cy="18"
                          fill="none"
                          r="16"
                          strokeDasharray="45"
                          strokeDashoffset="100"
                          strokeWidth="3"
                          style={{
                            strokeDashoffset: "calc(100 - (100 * 45) / 100)",
                            transform: "rotate(-90deg)",
                            transformOrigin: "50% 50%",
                            color: "#38a169",
                          }}
                        ></circle>
                      </svg>
                      <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-lg"
                        style={{ color: "#1a202c" }}
                      >
                        45°C
                      </div>
                    </div>
                    <p className="text-sm" style={{ color: "#4a5568" }}>
                      Motor Temp
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="p-4 rounded-xl border"
                style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
              >
                <h3
                  className="font-bold text-xl mb-4 px-2"
                  style={{ color: "#1a202c" }}
                >
                  Live Fleet Location
                </h3>
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg object-cover"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCdvN4JIhd_gAdoES8-Y3yzLq0kwAqz2M3cO62VCwepqReISNQnuqULoD2SL3ooKEJIuQhnc2x4-iI_gL9b4jyvQ673GcDQqZ5DaAGlsil_prVCadWWxB-zXHQA8sKHQryYzf269ssmSlkCVvwZCZ-OkFQCKZzcLT_4wMgQLec4MfOJX1XKX24VPI4oxp99sah2XYop6YTmcMrFzZXTLKQusyi3lzWEOA048QqETfnfnm1bgT_tv1eii0M_AuwHPiQRAHthF4GZffk")',
                  }}
                ></div>
              </div>
            </div>
            <div className="lg:col-span-1 flex flex-col gap-6">
              <div
                className="p-6 rounded-xl border"
                style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className="font-bold text-xl"
                    style={{ color: "#1a202c" }}
                  >
                    Urgent Alerts
                  </h3>
                  <div
                    className="flex items-center justify-center size-7 rounded-full text-white text-sm font-bold"
                    style={{ backgroundColor: "#c53030" }}
                  >
                    2
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div
                    className="border rounded-lg p-3"
                    style={{
                      backgroundColor: "#fef2f2",
                      borderColor: "#fecaca",
                    }}
                  >
                    <p className="font-medium" style={{ color: "#991b1b" }}>
                      Robot 04: Bin Full
                    </p>
                    <p className="text-sm" style={{ color: "#dc2626" }}>
                      Requires immediate emptying.
                    </p>
                  </div>
                  <div
                    className="border rounded-lg p-3"
                    style={{
                      backgroundColor: "#fff7ed",
                      borderColor: "#fed7aa",
                    }}
                  >
                    <p className="font-medium" style={{ color: "#9a3412" }}>
                      Robot 02: Path Blocked
                    </p>
                    <p className="text-sm" style={{ color: "#ea580c" }}>
                      Obstacle detected. Rerouting.
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="p-6 rounded-xl border"
                style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
              >
                <h3
                  className="font-bold text-xl mb-4"
                  style={{ color: "#1a202c" }}
                >
                  Recent Events
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex items-center justify-center size-10 rounded-lg"
                      style={{ backgroundColor: "#f3f4f6", color: "#38a169" }}
                    >
                      <Recycle size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: "#1a202c" }}>
                        Waste Detected
                      </p>
                      <p className="text-sm" style={{ color: "#4a5568" }}>
                        ROB-001 at Sector 4
                      </p>
                    </div>
                    <p className="text-sm" style={{ color: "#9ca3af" }}>
                      2m ago
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div
                      className="flex items-center justify-center size-10 rounded-lg"
                      style={{ backgroundColor: "#f3f4f6", color: "#38a169" }}
                    >
                      <CheckCircle size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: "#1a202c" }}>
                        Bin Emptied
                      </p>
                      <p className="text-sm" style={{ color: "#4a5568" }}>
                        ROB-004 at Dock 2
                      </p>
                    </div>
                    <p className="text-sm" style={{ color: "#9ca3af" }}>
                      15m ago
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div
                      className="flex items-center justify-center size-10 rounded-lg"
                      style={{ backgroundColor: "#f3f4f6", color: "#dd6b20" }}
                    >
                      <AlertTriangle size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: "#1a202c" }}>
                        Obstacle Avoided
                      </p>
                      <p className="text-sm" style={{ color: "#4a5568" }}>
                        ROB-002 near Fountain
                      </p>
                    </div>
                    <p className="text-sm" style={{ color: "#9ca3af" }}>
                      22m ago
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div
                      className="flex items-center justify-center size-10 rounded-lg"
                      style={{ backgroundColor: "#f3f4f6", color: "#38a169" }}
                    >
                      <Recycle size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: "#1a202c" }}>
                        Waste Detected
                      </p>
                      <p className="text-sm" style={{ color: "#4a5568" }}>
                        ROB-003 at Main Path
                      </p>
                    </div>
                    <p className="text-sm" style={{ color: "#9ca3af" }}>
                      28m ago
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div
                      className="flex items-center justify-center size-10 rounded-lg"
                      style={{ backgroundColor: "#f3f4f6", color: "#3b82f6" }}
                    >
                      <Zap size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: "#1a202c" }}>
                        Charging Started
                      </p>
                      <p className="text-sm" style={{ color: "#4a5568" }}>
                        ROB-001 at Dock 1
                      </p>
                    </div>
                    <p className="text-sm" style={{ color: "#9ca3af" }}>
                      45m ago
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
