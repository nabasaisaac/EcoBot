import { Sidebar } from '../components/Sidebar';

export const LiveMonitoringPage = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <p className="text-text-primary text-4xl font-black leading-tight tracking-[-0.033em]">
              Live Monitoring Dashboard
            </p>
            <div className="flex items-center gap-4">
              <button className="flex h-10 items-center justify-center gap-x-2 rounded-lg bg-card border border-border-color px-4">
                <p className="text-text-primary text-sm font-medium leading-normal">Robot: All</p>
                <span className="material-symbols-outlined text-text-secondary text-xl">expand_more</span>
              </button>
              <button className="flex items-center justify-center size-10 rounded-lg bg-card border border-border-color text-text-secondary">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="flex items-center justify-center size-10 rounded-lg bg-card border border-border-color text-text-secondary">
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="bg-card p-4 rounded-xl border border-border-color">
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
                      <p className="text-sm text-green-300">Status: Collecting</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full bg-red-500 animate-pulse"></div>
                      <span className="text-white font-medium">REC</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border-color">
                <h3 className="text-text-primary font-bold text-xl mb-4">Robot Vitals</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative size-24">
                      <svg className="size-full" height="36" viewBox="0 0 36 36" width="36" xmlns="http://www.w3.org/2000/svg">
                        <circle
                          className="stroke-current text-gray-200"
                          cx="18"
                          cy="18"
                          fill="none"
                          r="16"
                          strokeWidth="3"
                        ></circle>
                        <circle
                          className="stroke-current text-success"
                          cx="18"
                          cy="18"
                          fill="none"
                          r="16"
                          strokeDasharray="88"
                          strokeDashoffset="100"
                          strokeWidth="3"
                          style={{
                            strokeDashoffset: 'calc(100 - (100 * 88) / 100)',
                            transform: 'rotate(-90deg)',
                            transformOrigin: '50% 50%',
                          }}
                        ></circle>
                      </svg>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-text-primary font-bold text-lg">
                        88%
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary">Battery Level</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative size-24">
                      <svg className="size-full" height="36" viewBox="0 0 36 36" width="36" xmlns="http://www.w3.org/2000/svg">
                        <circle
                          className="stroke-current text-gray-200"
                          cx="18"
                          cy="18"
                          fill="none"
                          r="16"
                          strokeWidth="3"
                        ></circle>
                        <circle
                          className="stroke-current text-warning"
                          cx="18"
                          cy="18"
                          fill="none"
                          r="16"
                          strokeDasharray="65"
                          strokeDashoffset="100"
                          strokeWidth="3"
                          style={{
                            strokeDashoffset: 'calc(100 - (100 * 65) / 100)',
                            transform: 'rotate(-90deg)',
                            transformOrigin: '50% 50%',
                          }}
                        ></circle>
                      </svg>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-text-primary font-bold text-lg">
                        65%
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary">Bin Capacity</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative size-24">
                      <svg className="size-full" height="36" viewBox="0 0 36 36" width="36" xmlns="http://www.w3.org/2000/svg">
                        <circle
                          className="stroke-current text-gray-200"
                          cx="18"
                          cy="18"
                          fill="none"
                          r="16"
                          strokeWidth="3"
                        ></circle>
                        <circle
                          className="stroke-current text-success"
                          cx="18"
                          cy="18"
                          fill="none"
                          r="16"
                          strokeDasharray="92"
                          strokeDashoffset="100"
                          strokeWidth="3"
                          style={{
                            strokeDashoffset: 'calc(100 - (100 * 92) / 100)',
                            transform: 'rotate(-90deg)',
                            transformOrigin: '50% 50%',
                          }}
                        ></circle>
                      </svg>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-text-primary font-bold text-lg">
                        92%
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary">Connectivity</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative size-24">
                      <svg className="size-full" height="36" viewBox="0 0 36 36" width="36" xmlns="http://www.w3.org/2000/svg">
                        <circle
                          className="stroke-current text-gray-200"
                          cx="18"
                          cy="18"
                          fill="none"
                          r="16"
                          strokeWidth="3"
                        ></circle>
                        <circle
                          className="stroke-current text-success"
                          cx="18"
                          cy="18"
                          fill="none"
                          r="16"
                          strokeDasharray="45"
                          strokeDashoffset="100"
                          strokeWidth="3"
                          style={{
                            strokeDashoffset: 'calc(100 - (100 * 45) / 100)',
                            transform: 'rotate(-90deg)',
                            transformOrigin: '50% 50%',
                          }}
                        ></circle>
                      </svg>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-text-primary font-bold text-lg">
                        45°C
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary">Motor Temp</p>
                  </div>
                </div>
              </div>
              <div className="bg-card p-4 rounded-xl border border-border-color">
                <h3 className="text-text-primary font-bold text-xl mb-4 px-2">Live Fleet Location</h3>
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
              <div className="bg-card p-6 rounded-xl border border-border-color">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-text-primary font-bold text-xl">Urgent Alerts</h3>
                  <div className="flex items-center justify-center size-7 rounded-full bg-critical text-white text-sm font-bold">
                    2
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="font-medium text-red-800">Robot 04: Bin Full</p>
                    <p className="text-sm text-red-600">Requires immediate emptying.</p>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="font-medium text-orange-800">Robot 02: Path Blocked</p>
                    <p className="text-sm text-orange-600">Obstacle detected. Rerouting.</p>
                  </div>
                </div>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border-color">
                <h3 className="text-text-primary font-bold text-xl mb-4">Recent Events</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center size-10 rounded-lg bg-gray-100 text-success">
                      <span className="material-symbols-outlined">recycling</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-text-primary font-medium">Waste Detected</p>
                      <p className="text-sm text-text-secondary">ROB-001 at Sector 4</p>
                    </div>
                    <p className="text-sm text-gray-400">2m ago</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center size-10 rounded-lg bg-gray-100 text-success">
                      <span className="material-symbols-outlined">check_circle</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-text-primary font-medium">Bin Emptied</p>
                      <p className="text-sm text-text-secondary">ROB-004 at Dock 2</p>
                    </div>
                    <p className="text-sm text-gray-400">15m ago</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center size-10 rounded-lg bg-gray-100 text-warning">
                      <span className="material-symbols-outlined">warning</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-text-primary font-medium">Obstacle Avoided</p>
                      <p className="text-sm text-text-secondary">ROB-002 near Fountain</p>
                    </div>
                    <p className="text-sm text-gray-400">22m ago</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center size-10 rounded-lg bg-gray-100 text-success">
                      <span className="material-symbols-outlined">recycling</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-text-primary font-medium">Waste Detected</p>
                      <p className="text-sm text-text-secondary">ROB-003 at Main Path</p>
                    </div>
                    <p className="text-sm text-gray-400">28m ago</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center size-10 rounded-lg bg-gray-100 text-blue-500">
                      <span className="material-symbols-outlined">power</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-text-primary font-medium">Charging Started</p>
                      <p className="text-sm text-text-secondary">ROB-001 at Dock 1</p>
                    </div>
                    <p className="text-sm text-gray-400">45m ago</p>
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

