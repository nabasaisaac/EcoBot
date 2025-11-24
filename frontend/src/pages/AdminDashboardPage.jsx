import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import {
  Video,
  Gamepad2,
  BarChart3,
  Wrench,
  AlertCircle,
  AlertTriangle,
  Info,
  Route,
  Trash2,
  WifiOff,
  Zap,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

export const AdminDashboardPage = () => {
  return (
    <div className="flex h-screen" style={{ fontFamily: "Inter, sans-serif" }}>
      <Sidebar variant="admin-dashboard" />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Header variant="admin" />
        <main className="flex-1 p-6 lg:p-10 grid grid-cols-12 gap-6" style={{ backgroundColor: "#f8fafc" }}>
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col gap-2 rounded-lg p-4 border" style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}>
                <p className="text-sm font-medium leading-normal" style={{ color: "#64748b" }}>
                  Active Robots
                </p>
                <p className="tracking-light text-2xl font-bold leading-tight" style={{ color: "#1e293b" }}>
                  5/6
                </p>
              </div>
              <div className="flex flex-col gap-2 rounded-lg p-4 border" style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}>
                <p className="text-sm font-medium leading-normal" style={{ color: "#64748b" }}>
                  Avg. Battery
                </p>
                <p className="tracking-light text-2xl font-bold leading-tight" style={{ color: "#1e293b" }}>
                  88%
                </p>
              </div>
              <div className="flex flex-col gap-2 rounded-lg p-4 border" style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}>
                <p className="text-sm font-medium leading-normal" style={{ color: "#64748b" }}>
                  Connectivity
                </p>
                <p className="tracking-light text-2xl font-bold leading-tight" style={{ color: "#22c55e" }}>
                  Strong
                </p>
              </div>
              <div className="flex flex-col gap-2 rounded-lg p-4 border" style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}>
                <p className="text-sm font-medium leading-normal" style={{ color: "#64748b" }}>
                  Waste Capacity
                </p>
                <p className="tracking-light text-2xl font-bold leading-tight" style={{ color: "#1e293b" }}>
                  75%
                </p>
              </div>
            </div>
            <div className="flex flex-col rounded-lg border p-4 gap-4" style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}>
              <h3 className="font-bold text-lg" style={{ color: "#1e293b" }}>Real-Time Fleet Location</h3>
              <div
                className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-md object-cover"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCLBdURdgQ9NNS5duRHchuUEP-VchCS_Gkxb5CDVZmZmENEdA5SRVJc1QNcCSmYwjINtd_vIdw23-0NWXxEHR0aC-bc27jiWY0SRONGCAxVexNeGNRvS1l6h2o-r28Kr-sCvl4x_xop7B2nA0XvNorw-zARWGoZP6twWsvLuznrszwrAehFNxUm8g6SK-4AlUo5XVNkQDb5chZBUrMLXdmHMGIFfrkZB7EQim8Zbk5MAYCLcB55N_pKbBhODKczzDTYnC66lu52ce8")',
                }}
              ></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                to="/live-monitoring"
                className="flex flex-col items-center justify-center gap-3 p-4 rounded-lg border transition-colors cursor-pointer hover:opacity-80"
                style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(23, 86, 58, 0.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
              >
                <Video size={32} style={{ color: "#17563a" }} />
                <p className="font-semibold text-sm" style={{ color: "#1e293b" }}>
                  Live Monitoring
                </p>
              </Link>
              <Link
                to="/manual-control"
                className="flex flex-col items-center justify-center gap-3 p-4 rounded-lg border transition-colors cursor-pointer hover:opacity-80"
                style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(23, 86, 58, 0.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
              >
                <Gamepad2 size={32} style={{ color: "#17563a" }} />
                <p className="font-semibold text-sm" style={{ color: "#1e293b" }}>
                  Manual Control
                </p>
              </Link>
              <a
                href="#"
                className="flex flex-col items-center justify-center gap-3 p-4 rounded-lg border transition-colors cursor-pointer hover:opacity-80"
                style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(23, 86, 58, 0.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
              >
                <BarChart3 size={32} style={{ color: "#17563a" }} />
                <p className="font-semibold text-sm" style={{ color: "#1e293b" }}>
                  View Analytics
                </p>
              </a>
              <a
                href="#"
                className="flex flex-col items-center justify-center gap-3 p-4 rounded-lg border transition-colors cursor-pointer hover:opacity-80"
                style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(23, 86, 58, 0.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
              >
                <Wrench size={32} style={{ color: "#17563a" }} />
                <p className="font-semibold text-sm" style={{ color: "#1e293b" }}>
                  Maintenance
                </p>
              </a>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <div className="flex flex-col rounded-lg border p-4 gap-4" style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}>
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg" style={{ color: "#1e293b" }}>Notifications</h3>
                <a href="#" className="text-sm font-medium" style={{ color: "#17563a" }}>
                  View all
                </a>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3 p-3 rounded-md" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}>
                  <AlertCircle size={20} style={{ color: "#ef4444", marginTop: "2px" }} />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "#ef4444" }}>
                      Critical: Obstacle Detected
                    </p>
                    <p className="text-xs" style={{ color: "#64748b" }}>
                      Robot RBT-003 has stopped. Manual intervention required.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-md" style={{ backgroundColor: "rgba(249, 115, 22, 0.1)" }}>
                  <AlertTriangle size={20} style={{ color: "#f97316", marginTop: "2px" }} />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "#f97316" }}>
                      Alert: Bin Full
                    </p>
                    <p className="text-xs" style={{ color: "#64748b" }}>
                      Robot RBT-005 bin is at 95% capacity. Returning to base.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-md" style={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}>
                  <Info size={20} style={{ color: "#3b82f6", marginTop: "2px" }} />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "#3b82f6" }}>
                      Info: Route Completed
                    </p>
                    <p className="text-xs" style={{ color: "#64748b" }}>
                      Robot RBT-001 has completed its scheduled route.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col rounded-lg border p-4 gap-4 flex-1" style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}>
              <h3 className="font-bold text-lg" style={{ color: "#1e293b" }}>Recent Activity</h3>
              <div className="flex-1 overflow-y-auto pr-2">
                <ul className="flex flex-col gap-4">
                  <li className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center size-8 rounded-full"
                      style={{ backgroundColor: "rgba(23, 86, 58, 0.1)", color: "#17563a" }}
                    >
                      <Route size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: "#1e293b" }}>
                        Route Started - RBT-004
                      </p>
                      <p className="text-xs" style={{ color: "#64748b" }}>
                        2 mins ago
                      </p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center size-8 rounded-full"
                      style={{ backgroundColor: "rgba(23, 86, 58, 0.1)", color: "#17563a" }}
                    >
                      <Trash2 size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: "#1e293b" }}>
                        Bin Emptied - RBT-002
                      </p>
                      <p className="text-xs" style={{ color: "#64748b" }}>
                        5 mins ago
                      </p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center size-8 rounded-full"
                      style={{ backgroundColor: "rgba(249, 115, 22, 0.1)", color: "#f97316" }}
                    >
                      <WifiOff size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: "#1e293b" }}>
                        Lost Connection - RBT-006
                      </p>
                      <p className="text-xs" style={{ color: "#64748b" }}>
                        8 mins ago
                      </p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center size-8 rounded-full"
                      style={{ backgroundColor: "rgba(23, 86, 58, 0.1)", color: "#17563a" }}
                    >
                      <Zap size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: "#1e293b" }}>
                        Now Charging - RBT-001
                      </p>
                      <p className="text-xs" style={{ color: "#64748b" }}>
                        15 mins ago
                      </p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center size-8 rounded-full"
                      style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}
                    >
                      <XCircle size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: "#1e293b" }}>
                        Obstacle Detected - RBT-003
                      </p>
                      <p className="text-xs" style={{ color: "#64748b" }}>
                        18 mins ago
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
