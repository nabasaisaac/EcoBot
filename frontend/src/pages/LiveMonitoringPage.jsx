import { Sidebar } from '../components/Sidebar';
import { CircularProgress } from '../components/CircularProgress';
import { ThemeToggle } from '../components/ThemeToggle';

export const LiveMonitoringPage = () => {
  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark font-display text-gray-300">
      <Sidebar variant="admin" />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Heading */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <p className="text-white dark:text-slate-800 text-4xl font-black leading-tight tracking-[-0.033em]">
              Live Monitoring Dashboard
            </p>
            <div className="flex items-center gap-4">
              <button className="flex h-10 items-center justify-center gap-x-2 rounded-lg bg-primary/30 dark:bg-white/10 px-4">
                <p className="text-white dark:text-slate-800 text-sm font-medium leading-normal">Robot: All</p>
                <span className="material-symbols-outlined text-white dark:text-slate-800 text-xl">expand_more</span>
              </button>
              <button className="flex items-center justify-center size-10 rounded-lg bg-primary/30 dark:bg-white/10 text-white dark:text-slate-800">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <ThemeToggle />
              <button className="flex items-center justify-center size-10 rounded-lg bg-primary/30 dark:bg-white/10 text-white dark:text-slate-800">
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Camera Feed */}
              <div className="bg-[#294237]/50 dark:bg-white/5 p-4 rounded-xl">
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
                      <p className="text-sm text-green-300">Status: Collecting</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full bg-critical animate-pulse"></div>
                      <span className="text-white font-medium">REC</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Robot Vitals */}
              <div className="bg-[#294237]/50 dark:bg-white/5 p-6 rounded-xl">
                <h3 className="text-white dark:text-slate-800 font-bold text-xl mb-4">Robot Vitals</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <CircularProgress value={88} color="success" label="Battery Level" />
                  <CircularProgress value={65} color="warning" label="Bin Capacity" />
                  <CircularProgress value={92} color="success" label="Connectivity" />
                  <CircularProgress value={45} color="success" label="Motor Temp" unit="°C" />
                </div>
              </div>

              {/* Map */}
              <div className="bg-[#294237]/50 dark:bg-white/5 p-4 rounded-xl">
                <h3 className="text-white dark:text-slate-800 font-bold text-xl mb-4 px-2">Live Fleet Location</h3>
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
              <div className="bg-[#294237]/50 dark:bg-white/5 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white dark:text-slate-800 font-bold text-xl">Urgent Alerts</h3>
                  <div className="flex items-center justify-center size-7 rounded-full bg-critical text-white text-sm font-bold">
                    2
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="bg-critical/20 dark:bg-critical/10 border border-critical rounded-lg p-3">
                    <p className="font-medium text-red-200 dark:text-red-800">Robot 04: Bin Full</p>
                    <p className="text-sm text-red-300 dark:text-red-600">Requires immediate emptying.</p>
                  </div>
                  <div className="bg-warning/20 dark:bg-warning/10 border border-warning rounded-lg p-3">
                    <p className="font-medium text-amber-200 dark:text-amber-800">Robot 02: Path Blocked</p>
                    <p className="text-sm text-amber-300 dark:text-amber-600">Obstacle detected. Rerouting.</p>
                  </div>
                </div>
              </div>

              {/* Recent Events */}
              <div className="bg-[#294237]/50 dark:bg-white/5 p-6 rounded-xl">
                <h3 className="text-white dark:text-slate-800 font-bold text-xl mb-4">Recent Events</h3>
                <div className="flex flex-col gap-4">
                  {[
                    { icon: 'recycling', title: 'Waste Detected', desc: 'ROB-001 at Sector 4', time: '2m ago', color: 'success' },
                    { icon: 'check_circle', title: 'Bin Emptied', desc: 'ROB-004 at Dock 2', time: '15m ago', color: 'success' },
                    { icon: 'warning', title: 'Obstacle Avoided', desc: 'ROB-002 near Fountain', time: '22m ago', color: 'warning' },
                    { icon: 'recycling', title: 'Waste Detected', desc: 'ROB-003 at Main Path', time: '28m ago', color: 'success' },
                    { icon: 'power', title: 'Charging Started', desc: 'ROB-001 at Dock 1', time: '45m ago', color: 'info' },
                  ].map((event, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className={`flex items-center justify-center size-10 rounded-lg bg-primary/30 dark:bg-primary/10 text-${event.color}`}>
                        <span className="material-symbols-outlined">{event.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-white dark:text-slate-800 font-medium">{event.title}</p>
                        <p className="text-sm text-gray-400 dark:text-slate-600">{event.desc}</p>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-slate-600">{event.time}</p>
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

