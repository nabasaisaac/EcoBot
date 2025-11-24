import { Sidebar } from "../components/Sidebar";
import { CircularProgress } from "../components/CircularProgress";
import { ThemeToggle } from "../components/ThemeToggle";

export const LiveMonitoringPage = () => {
  return (
    <div className="flex h-screen bg-background dark:bg-background-dark font-display text-text-primary">
      <Sidebar variant="admin" />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Heading */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <p className="text-text-primary dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              Live Monitoring Dashboard
            </p>
            <div className="flex items-center gap-4">
              <button className="flex h-10 items-center justify-center gap-x-2 rounded-lg bg-card dark:bg-white/10 border border-border-color dark:border-white/20 px-4">
                <p className="text-text-primary dark:text-white text-sm font-medium leading-normal">
                  Robot: All
                </p>
                <span className="material-symbols-outlined text-text-secondary dark:text-white/70 text-xl">
                  expand_more
                </span>
              </button>
              <button className="flex items-center justify-center size-10 rounded-lg bg-card dark:bg-white/10 border border-border-color dark:border-white/20 text-text-secondary dark:text-white/70">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <ThemeToggle />
              <button className="flex items-center justify-center size-10 rounded-lg bg-card dark:bg-white/10 border border-border-color dark:border-white/20 text-text-secondary dark:text-white/70">
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Camera Feed */}
              <div className="bg-card dark:bg-white/10 p-4 rounded-xl border border-border-color dark:border-white/20">
                <div
                  className="relative flex items-end justify-start bg-cover bg-center aspect-video rounded-lg p-4"
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDazPRjgy9PmHGqrsiIcS9lTKv1fp6Xwz16f-_vPnfi0flhY8y2IetHEZVTwHpoPkMG57_YmA3ryFc1JNljDOvHZfo_mXV0LO5p10qkJDWcMlbi6abntRTocbaYvUhXGW-P5q-nt0gYMce6N3LgOz4BVfmHiu2zlggShF8TJGMPWSzmXKL4BtSFlEiHPTDZSzH_UwtuwdTFXynR1Cu4IM3C-u2xfrqcYjKl7YhCcGapGpPYZhhPQo4UFUHiIPnuc85-_CVVpgs24yY")`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
                  <div className="relative flex justify-between items-center w-full">
                    <div>
                      <h3 className="text-white font-bold text-lg">ROB-001</h3>
                      <p className="text-sm text-green-300 dark:text-green-400">
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

              {/* Robot Vitals */}
              <div className="bg-card dark:bg-white/10 p-6 rounded-xl border border-border-color dark:border-white/20">
                <h3 className="text-text-primary dark:text-white font-bold text-xl mb-4">
                  Robot Vitals
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <CircularProgress
                    value={88}
                    color="success"
                    label="Battery Level"
                  />
                  <CircularProgress
                    value={65}
                    color="warning"
                    label="Bin Capacity"
                  />
                  <CircularProgress
                    value={92}
                    color="success"
                    label="Connectivity"
                  />
                  <CircularProgress
                    value={45}
                    color="success"
                    label="Motor Temp"
                    unit="°C"
                  />
                </div>
              </div>

              {/* Map */}
              <div className="bg-card dark:bg-white/10 p-4 rounded-xl border border-border-color dark:border-white/20">
                <h3 className="text-text-primary dark:text-white font-bold text-xl mb-4 px-2">
                  Live Fleet Location
                </h3>
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg object-cover"
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCdvN4JIhd_gAdoES8-Y3yzLq0kwAqz2M3cO62VCwepqReISNQnuqULoD2SL3ooKEJIuQhnc2x4-iI_gL9b4jyvQ673GcDQqZ5DaAGlsil_prVCadWWxB-zXHQA8sKHQryYzf269ssmSlkCVvwZCZ-OkFQCKZzcLT_4wMgQLec4MfOJX1XKX24VPI4oxp99sah2XYop6YTmcMrFzZXTLKQusyi3lzWEOA048QqETfnfnm1bgT_tv1eii0M_AuwHPiQRAHthF4GZffk")`,
                  }}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              {/* Alerts */}
              <div className="bg-card dark:bg-white/10 p-6 rounded-xl border border-border-color dark:border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-text-primary dark:text-white font-bold text-xl">
                    Urgent Alerts
                  </h3>
                  <div className="flex items-center justify-center size-7 rounded-full bg-critical text-white text-sm font-bold">
                    2
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="font-medium text-red-800 dark:text-red-300">
                      Robot 04: Bin Full
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Requires immediate emptying.
                    </p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                    <p className="font-medium text-orange-800 dark:text-orange-300">
                      Robot 02: Path Blocked
                    </p>
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      Obstacle detected. Rerouting.
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Events */}
              <div className="bg-card dark:bg-white/10 p-6 rounded-xl border border-border-color dark:border-white/20">
                <h3 className="text-text-primary dark:text-white font-bold text-xl mb-4">
                  Recent Events
                </h3>
                <div className="flex flex-col gap-4">
                  {[
                    {
                      icon: "recycling",
                      title: "Waste Detected",
                      desc: "ROB-001 at Sector 4",
                      time: "2m ago",
                      color: "success",
                    },
                    {
                      icon: "check_circle",
                      title: "Bin Emptied",
                      desc: "ROB-004 at Dock 2",
                      time: "15m ago",
                      color: "success",
                    },
                    {
                      icon: "warning",
                      title: "Obstacle Avoided",
                      desc: "ROB-002 near Fountain",
                      time: "22m ago",
                      color: "warning",
                    },
                    {
                      icon: "recycling",
                      title: "Waste Detected",
                      desc: "ROB-003 at Main Path",
                      time: "28m ago",
                      color: "success",
                    },
                    {
                      icon: "power",
                      title: "Charging Started",
                      desc: "ROB-001 at Dock 1",
                      time: "45m ago",
                      color: "info",
                    },
                  ].map((event, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="flex items-center justify-center size-10 rounded-lg bg-gray-100 dark:bg-white/10 text-success dark:text-primary">
                        <span className="material-symbols-outlined text-lg">
                          {event.icon}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-text-primary dark:text-white font-medium text-sm">
                          {event.title}
                        </p>
                        <p className="text-sm text-text-secondary dark:text-white/70">
                          {event.desc}
                        </p>
                      </div>
                      <p className="text-sm text-gray-400 dark:text-white/50">
                        {event.time}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
