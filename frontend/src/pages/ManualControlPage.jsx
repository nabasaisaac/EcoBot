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

export const ManualControlPage = () => {
  return (
    <div
      className="relative flex min-h-screen w-full"
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-2">
              <div className="flex justify-between items-center">
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
                  Latency: 50ms
                </p>
              </div>
              <div
                className="relative flex items-center justify-center bg-gray-900 bg-cover bg-center aspect-video rounded-xl overflow-hidden"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBRLwONZTijW7IeTzW5teV4W0w4H1PM5TBXQ14jrqn302xpwCUeeM4T1GyiQ3dEW0b8zQeNW_oE7yhn5oT-AM0Ix8s3d7bh0ZTqp3dhV0dH3FvKYhhZpu5nWIZKQlNL0-W6B0I0cDcjX5Ibjgh2RczG5hTevRhc-WRFj08Y1vNlS0IIkiwzfav46GI_k-PsDUlcjed_WUv_NQIYQlt3x_wPBve72lxZl6lYdJDF2Z9SsSWqidX1uQlP5DsKe-c3L3wSJYYZXaJn4HE")',
                }}
              >
                <button className="flex shrink-0 items-center justify-center rounded-full size-16 bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-colors">
                  <Play size={40} fill="#ffffff" />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div
                className="bg-white p-6 rounded-xl border"
                style={{ borderColor: "#e5e7eb" }}
              >
                <h2
                  className="text-xl font-semibold leading-tight mb-6"
                  style={{ color: "#111827" }}
                >
                  Controls
                </h2>
                <div className="flex justify-center items-center mb-6">
                  <div
                    className="relative w-48 h-48 rounded-full flex items-center justify-center border"
                    style={{
                      backgroundColor: "#f0f2f5",
                      borderColor: "#e5e7eb",
                    }}
                  >
                    <div
                      className="absolute w-full h-full"
                      style={{ color: "#9ca3af" }}
                    >
                      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 p-2">
                        <ArrowLeft size={24} />
                      </div>
                      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 p-2">
                        <ArrowRight size={24} />
                      </div>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2">
                        <ArrowUp size={24} />
                      </div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 p-2">
                        <ArrowDown size={24} />
                      </div>
                    </div>
                    <div
                      className="w-24 h-24 rounded-full cursor-grab active:cursor-grabbing shadow-lg"
                      style={{ backgroundColor: "#17563a" }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className="col-span-1 text-white font-semibold py-3 px-4 rounded-md flex items-center justify-center gap-2 hover:opacity-90 transition-colors"
                    style={{ backgroundColor: "#17563a" }}
                  >
                    <Play size={20} /> Start
                  </button>
                  <button
                    className="col-span-1 font-semibold py-3 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-gray-300 transition-colors"
                    style={{ backgroundColor: "#e5e7eb", color: "#111827" }}
                  >
                    <Pause size={20} /> Stop
                  </button>
                  <button
                    className="col-span-2 py-3 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-gray-300 transition-colors font-medium"
                    style={{ backgroundColor: "#e5e7eb", color: "#111827" }}
                  >
                    <Recycle size={20} /> Collect Rubbish
                  </button>
                  <button className="col-span-2 bg-red-600 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-red-700 transition-colors">
                    <AlertTriangle size={20} /> EMERGENCY STOP
                  </button>
                </div>
              </div>
              <div
                className="bg-white p-6 rounded-xl border"
                style={{ borderColor: "#e5e7eb" }}
              >
                <h2
                  className="text-xl font-semibold leading-tight mb-4"
                  style={{ color: "#111827" }}
                >
                  Live Status
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div
                      className="flex items-center gap-3"
                      style={{ color: "#6b7280" }}
                    >
                      <Battery size={20} style={{ color: "#17563a" }} />
                      <p className="text-sm">Battery Level</p>
                    </div>
                    <p
                      className="font-semibold text-sm"
                      style={{ color: "#111827" }}
                    >
                      85%
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div
                      className="flex items-center gap-3"
                      style={{ color: "#6b7280" }}
                    >
                      <Signal size={20} style={{ color: "#17563a" }} />
                      <p className="text-sm">Signal Strength</p>
                    </div>
                    <p
                      className="font-semibold text-sm"
                      style={{ color: "#111827" }}
                    >
                      Excellent
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div
                      className="flex items-center gap-3"
                      style={{ color: "#6b7280" }}
                    >
                      <RefreshCw size={20} style={{ color: "#6b7280" }} />
                      <p className="text-sm">Motor Status</p>
                    </div>
                    <p
                      className="font-medium text-sm"
                      style={{ color: "#111827" }}
                    >
                      Idle
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div
                      className="flex items-center gap-3"
                      style={{ color: "#6b7280" }}
                    >
                      <Bot size={20} style={{ color: "#6b7280" }} />
                      <p className="text-sm">Current Mode</p>
                    </div>
                    <p
                      className="font-medium text-sm"
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
